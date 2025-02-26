import React from 'react'

function AboutMe() {
    return (
      <div className="mt-6 ml-8 max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">About Me</h2>
        <p className="text-lg text-gray-600 mb-4">Get to know the person behind this project!</p>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-purple-500">
          <p className="leading-relaxed text-gray-700">
            Hello everyone! My name is <span className="font-semibold text-purple-600">Nicolas</span>, 
            and I am currently attending EvCC as a CS major. My goal is to empower individuals by building intuitive 
            and impactful technology that helps them learn, grow, and prepare for real-world challenges.
          </p>
  
          <hr className="my-4 border-gray-300" />
  
          <p className="leading-relaxed text-gray-700">
          In this application, I present you, your own <span className="font-semibold text-purple-600">AI Mock Interviewer</span> to help you achieve that dream job! Keep Pushing and Happy Interviewing!
          </p>
        </div>
      </div>
    );
  }
  
  export default AboutMe;
  
