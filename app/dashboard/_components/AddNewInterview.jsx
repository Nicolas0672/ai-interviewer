"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
  
function AddNewInterview() {
    const[openDialogue, setOpenDialogue] = useState(false)
    const [jobPosition, setJobPosition] = useState();
    const [jobDes, setJobDes] = useState();
    const [jobExperience, setJobExperience] = useState();

    const onSubmit= (e)=>{
        e.preventDefault()
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover: shadow-md cursor-pointer transition-all
        '
        onClick={() => setOpenDialogue(true)}
        >
            <h2 className=' text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialogue}>
        
        <DialogContent className='max-w-2xl'>
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>                   
                    
                    <h2>Add Details about your job position/role, job description and years of experience</h2>
                    <div className='mt-7 my-5'>
                        <label>Job Role Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required
                        onChange={(event) => setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className=' my-5'>
                        <label>Job Description/ Tech Stack</label>
                        <Textarea placeholder="Ex. React, Angular, NodeJs ect" required
                        onChange={(event) => setJobDes(event.target.value)}
                        />
                    </div>
                    <div className=' my-5'>
                        <label>Years of experience</label>
                        <Input placeholder="Ex. 5" type="number" max="50"required
                        onChange={(event) => setJobExperience(event.target.value)}/>
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={() => setOpenDialogue(false)}>Cancel</Button>
                    <Button type="submit">Start Interview</Button>
                </div>
            </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog> 

    </div>
  )
}

export default AddNewInterview