import { Button } from '@/components/ui/button'
import { Lightbulb, Volume2 } from 'lucide-react'
import React, { useState } from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex, userAnswer}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const textToSpeech=(text) =>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        }
        else{
            alert("Sorry, your browser does not support text-to-speech")
        }
    }

    const toggleAnswerVisibility= () =>{
        setShowAnswer((prev) => !prev)
    }

  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question, index)=>(
                 <h2 key={index} className={`p-2 bg-secondary rounded-full
                 text-xs md:text-sm text-center 
                ${activeQuestionIndex === index ? '!bg-purple-300 text-black' : ''}`}>Question #{index + 1}</h2>
            ))}
  
        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 className='cursor-pointer'onClick={() =>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5 bg-blue-100 mt-10'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note: </strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>Click 'Record Answer' when you're ready. Take a deep breath, stay calm, and visualize success.
            </h2>
            
        </div>
        {userAnswer[activeQuestionIndex]&& (
            <Button className='mt-10'  onClick={toggleAnswerVisibility}>
                {showAnswer ? 'Hide User Answer':'Show User Answer'}
            </Button>
        )}
         {showAnswer && userAnswer[activeQuestionIndex] && (
                <div className='mt-5 p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto'>
                    <h3>Your Answer:</h3>
                    <p>{userAnswer[activeQuestionIndex]}</p> {/* This will display the full answer */}
                </div>
            )}
        
    </div>
    

  )
}

export default QuestionsSection