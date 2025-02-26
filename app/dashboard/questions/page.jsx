"use client";
import { useState } from "react";

const faqs = [
  { question: "What is this AI Mock Interview app?", answer: "This app helps you practice mock interviews by providing real-world interview questions and allowing you to record and review your answers." },
  { question: "How do I start a mock interview?", answer: "Go to the Dashboard, click 'Start New Interview,' and follow the instructions to record and review your answers." },
  { question: "What happens after I submit my answers?" , answer: "Your answers are saved in your interview history. You can review them anytime from the Previous Interviews section."},
  { question: "How can I improve my answers?", answer: "Listen to your recorded responses. Check AI-generated feedback. Try re-recording for better fluency. Practice multiple times to gain confidence."},
 {question: "Can I download my interview recordings?", answer: "This feature is coming soon! Please stay tuned"},
    {question: "Are my recordings stored securely?", answer:"Yes! Your data is securely stored and only accessible to you."}
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-3 ml-8 max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📌 Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <button
              className="w-full text-left font-medium"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
            </button>
            {openIndex === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
