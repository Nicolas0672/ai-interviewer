"use client"
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'

function RecordAnswerSection({setUserAnswer, userAnswer, activeQuestionIndex}) {
    
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        if (results.length > 0) {
            const newAnswer = [...userAnswer]
            newAnswer[activeQuestionIndex] = results.map(r => r.transcript).join(" ")
            setUserAnswer(newAnswer);
        }
      }, [results])


  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col my-9 justify-center bg-black items-center rounded-lg border p-5'>
            <Image src={'/webcam.png'} width={200} height={200} alt="logo" priority
            className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}/>

        </div>
        <Button varaint='outline' className="my-6"
        onClick={isRecording?stopSpeechToText:startSpeechToText}
        >
            {isRecording?
            <h2 className='text-red-700 flex gap-2'>
                <Mic/> Stop Recording
            </h2>
            :
                'Record Answer'
            }
            </Button>
            
    </div>
  )
}

export default RecordAnswerSection