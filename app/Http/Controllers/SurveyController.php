<?php

namespace App\Http\Controllers;

use App\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Validator;



class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(
            survey::where('user_id',$user->id)
                ->orderBy('created_at','desc')
                ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request)
    {
        $data= $request->validated();

        // check if image was given and save on local storge
        if (isset($data['image'])){
            $relativPath = $this->saveImage($data['image']);
            $data['image'] = $relativPath;
        }
        $survey = Survey::create($data);

        // create question
        foreach($data['questions'] as $question){
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }
        return new SurveyResource($survey);
    }


    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403,'Uauthorized action');
        }
        return new SurveyResource($survey);
    }

   

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();

        // check if image was given and save it on local storage
        if(isset($data['image'])){
            $relativPath = $this->saveImage($data['image']);
            $data['image'] = $relativPath;

            // check if old image exist and delete it
            if($survey->image){
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }
        //update survey in database
        $survey->update($data);
        // Get array as plain array of existing qeutions
        $existingIds = $survey->questions()->pluck('id')->toArray();
        // Get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'],'id');
        //Find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        // Add new quedtions 
        $toAdd = array_diff($newIds,$existingIds);

        // delete questions by $toDelete array
        SurveyQuestion::destroy($toDelete);



        //create new qeutions
        foreach ($data['questions'] as $question){
            if (in_array($question['id'],$toAdd)){
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        //update existing question
        $questionMap = collect($data['questions'])->keyBy('id');

        foreach ($survey->questions as $question){
            if (isset($questionMap[$question->id])){
                $this->updateQuestion($question,$questionMap[$question->id]);
            }
        }
        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey , Request $request)
    {
        $user = $request->user();
        if($user->id !==$survey->user_id) {
            return abort(403, 'Unathorized action.');
        }

        $survey->delete();

        if($survey->image) {
            $absolutePath = public_path(($survey->image));
            File::delete($absolutePath);
        }
        return response('',204);
    }

    private function saveImage($image)
    {
        if (preg_match('/^data:image\/(\w+);base64,/',$image,$type)){
            $image = substr($image, strpos($image,',')+ 1);

            $type = strtolower($type[1]);

            if(!in_array($type,['jpg','jpeg','gif','png'])){
                throw new \Exception('invaild image type');
            }
            $image = str_replace('','+',$image);
            $image = base64_decode($image);

            if($image === false){
                throw new \Exception('base64_decode failed');
            }
            
        }else {
                throw new \Exception('did not match data URL with immage data');
            }
        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativPath = $dir . $file;
        if(!File::exists($absolutePath)){
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativPath, $image);

        return $relativPath;
    }
    
    private function createQuestion($data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode(($data['data']));
        }

        $validator = Validator::make($data,[
            'question' => 'required|string',
            'type' => ['required',new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' =>'required|string',
            'type' => ['required',new Enum(QuestionTypeEnum::class)],
            'description' =>'nullable|string',
            'data' => 'present'
        ]);

        return $question->update($validator->validated());
    }

    public function getBySlug (Survey $survey)
    {
        if (!$survey->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($survey->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }

        return new SurveyResource($survey);
    }

    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey)
    {
        $validated = $request->validated();

        $surveyAnswer = SurveyAnswer::create([
            'survey_id'=>$survey->id,
            'start_date'=>date('Y-m-d H:i:s'),
            'end_date'=>date('Y-m-d H:i:s'),
        ]);

        foreach($validated['answers'] as $questionId => $answer){
            $question = SurveyQuestion::where(['id' => $questionId,'survey_id'=>$survey->id])->get();
            
            if (!$question){
                return response("Invaild question ID: \"$questionId\"",400);
            }

            $data = [
                'survey_question_id' => $questionId,
                'survey_answer_id' => $surveyAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = SurveyQuestionAnswer::create($data);
        }
        return response("", 201);
    }
}
