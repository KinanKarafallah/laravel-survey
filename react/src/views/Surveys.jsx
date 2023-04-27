import { PlusCircleIcon } from "@heroicons/react/24/outline";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import { useStateContext } from "../contexts/ContextProvider";
import { useState, useEffect } from "react";
import PaginationLinks from "../components/paginationLinks";
import router from "../router";


export default function Surveys() {
  const {showToast} = useStateContext();
  const [surveys,setSurveys] = useState([]);
  const [loading,setLoading] = useState(false);
  const [meta,setMeta] = useState({});
  //const {surveys} = useStateContext();
  

  const onDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delet this survey?')){
      axiosClient.delete(`/survey/${id}`)
        .then(() => {
          getSurvey()
          showToast('The survey was deleted successfully')
        })
    }
    
  }
  
  const onPageClick = (link) => {
    getSurvey(link.url)

  }

  const getSurvey = (url) => {
    url = url || '/survey'

    setLoading(true)
    axiosClient.get(url)
      .then(({ data }) => {
        setSurveys(data.data)
        setMeta(data.meta)
        setLoading(false)
      })
  }

  useEffect(() => {
    getSurvey()
    
  }, []);

  return (
    <PageComponent 
      title="Surveys" 
      buttons={(
        <TButton color="green" to="/surveys/create">
          <PlusCircleIcon className="h-6 w-6 mr-2"/>
          Create new
        </TButton>
      )}
    >

      {loading && <div>Loading.....</div>}

      {!loading && (
        <div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {surveys.map((survey) => (
              <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick}/>
            ))}
          </div>
          <PaginationLinks meta={meta} onPageClick={onPageClick}/>
        </div>
      )}
    </PageComponent>
  )
}