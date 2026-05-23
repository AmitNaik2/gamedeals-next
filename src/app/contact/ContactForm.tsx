"use client";

import { useState } from "react";

export function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(event.currentTarget);
    const dataObj = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
      });

      const data = await response.json();
      if (response.ok) {
        setResult("Success! Your message has been sent.");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult(data.message || "Error sending message");
      }
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" id="email" name="email" required className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea id="message" name="message" required rows={5} className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg self-start transition-colors"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
      {result && (
        <p className={`mt-2 font-medium ${result.includes("Success") ? "text-green-600" : "text-red-600"}`}>
          {result}
        </p>
      )}
    </form>
  );
}
