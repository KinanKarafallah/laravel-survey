import { createContext } from "react"
import { useState } from "react";
import { useContext } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken:null,
    surveys: [],
    toast: {
      message: null,
      show:false,
    },
    questionTypes: [],
    setCurrentUser: () => {},
    setUserToken : () => {},
})

const tmpSurveys = [
    {
        "id": 1,
        "image_url": "https://pbs.twimg.com/profile_images/1011277014924496897/aTMLLVVZ_400x400.jpg",
        "title": "TheCodeholic YouTube channel",
        "slug": "thecodeholic-youtube-channel",
        "status": true,
        "description": "My name is Zura.<br>I am Web Developer with 9+ years of experience, free educational content creator, CTO, Lecturer and father of two wonderful daughters.<br><br>The purpose of the channel is to share my several years of experience with beginner developers.<br>Teach them what I know and make my experience as a lesson for others.",
        "created_at": "2022-01-07 13:23:41",
        "updated_at": "2022-01-18 16:34:19",
        "expire_date": "2022-01-23",
        "questions": [
          {
            "id": 15,
            "type": "text",
            "question": "From which country are you?",
            "description": null
          },
          {
            "id": 16,
            "type": "checkbox",
            "question": "Which language videos do you want to see on my channel?",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
            "data": {
              "options": [
                {
                  "uuid": "8ee03188-9e7e-44e5-9176-7574c0beec6f",
                  "text": "JavaScript"
                },
                {
                  "uuid": "fe9497f2-8f05-4c82-9586-26e36736fa9e",
                  "text": "PHP"
                },
                {
                  "uuid": "db0f194c-d32d-4e19-929e-08f7b4e2bcc0",
                  "text": "HTML + CSS"
                },
                {
                  "uuid": "93273c4c-ac8f-432e-b847-e467df64ab9c",
                  "text": "All of the above"
                },
                {
                  "uuid": "d54818a7-ad7e-4b69-9287-16a8dc50a6cb",
                  "text": "Everything Zura thinks will be good"
                }
              ]
            }
          },
          {
            "id": 17,
            "type": "select",
            "question": "Which PHP framework videos do you want to see on my channel?",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
            "data": {
              "options": [
                {
                  "uuid": "fb907cfe-b7a1-4b24-86fb-03f9c44aa710",
                  "text": "Laravel"
                },
                {
                  "uuid": "e2629262-93ca-4a7a-8129-19c765664a04",
                  "text": "Yii2"
                },
                {
                  "uuid": "9a11a425-d9fe-4fe9-86af-bb814e3d9271",
                  "text": "Codeigniter"
                },
                {
                  "uuid": "484268b1-d3aa-47f8-a185-356ed48e50fe",
                  "text": "Symfony"
                }
              ]
            }
          },
          {
            "id": 18,
            "type": "radio",
            "question": "Which Laravel Framework do you love most?",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
            "data": {
              "options": [
                {
                  "uuid": "c02e50e6-5ebf-4344-9822-baa16502dbdb",
                  "text": "Laravel 5"
                },
                {
                  "uuid": "90a15aae-ef4c-4d04-aa05-8e840d4a2ded",
                  "text": "Laravel 6"
                },
                {
                  "uuid": "93c64532-c1eb-4bfd-bd00-ab51cafdee78",
                  "text": "Laravel 7"
                },
                {
                  "uuid": "51f6a704-7a86-47a4-9b2d-72bb026a3371",
                  "text": "Laravel 8"
                }
              ]
            }
          },
          {
            "id": 19,
            "type": "checkbox",
            "question": "What type of projects do you want to see on my channel built with Laravel?",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
            "data": {
              "options": [
                {
                  "uuid": "c5519ab0-3282-4758-a34b-506052bf1342",
                  "text": "REST API"
                },
                {
                  "uuid": "dfbbc0af-8fff-44ae-be36-e85270041729",
                  "text": "E-commerce"
                },
                {
                  "uuid": "6940c122-505f-4d9d-a103-472f923fad94",
                  "text": "Real Estate"
                },
                {
                  "uuid": "2b3c12a4-8f3c-4276-ae59-4e9d55e849be",
                  "text": "All of the above"
                }
              ]
            }
          },
          {
            "id": 22,
            "type": "textarea",
            "question": "What do you think about TheCodeholic channel?",
            "description": "Write your honest opinion. Everything is anonymous.",
            "data": []
          },
          {
            "id": 23,
            "type": "text",
            "question": "Which channel is your favorite one?",
            "description": null,
            "data": []
          }
        ]
      },
      {
        "id": 2,
        "image_url": "data:image/png;base64,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",
        "title": "React",
        "slug": "react",
        "status": true,
        "description": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
        "created_at": "2022-01-07 08:50:40",
        "updated_at": "2022-01-07 13:37:37",
        "expire_date": "2022-02-01",
        "questions": []
      },
      {
        "id": 3,
        "image_url": "data:image/png;base64,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",
        "title": "Laravel 9",
        "slug": "laravel-9",
        "status": true,
        "description": "Laravel is a web application framework with expressive, elegant syntax. We\u2019ve already laid the foundation \u2014 freeing you to create without sweating the small things.",
        "created_at": "2022-01-07 13:28:56",
        "updated_at": "2022-01-07 13:28:56",
        "expire_date": "2022-01-20",
        "questions": []
      },

]


export const ContextProvider = ({children}) => {
  const [currentUser , setCurrentUser] = useState({});
  const [userToken , _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [surveys , setSurveys] = useState(tmpSurveys);
  const [toast , setToast] = useState({message:'',show:false});
  const [questionTypes] = useState(['text','select','radio','checkbox','textarea'])

  const setUserToken = (token) => {
    if(token) {
      localStorage.setItem('TOKEN',token)
    }else {
      localStorage.removeItem("TOKEN")
    }
    _setUserToken(token);

  };


  const showToast = (message) => {
    setToast({message,show:true})
    setTimeout(()=>{
      setToast({message:'',show:false})
    },4000)
  }

  return(
      <StateContext.Provider value={{
          currentUser,
          setCurrentUser,
          userToken,
          setUserToken,
          surveys,
          questionTypes,
          toast,
          showToast,
      }}>
          {children}
      </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)