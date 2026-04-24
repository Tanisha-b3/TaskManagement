// frontend/src/Pages/Help.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: 'How do I create a new task?',
      answer: 'Click the "New Task" button in the header or navigate to the Tasks page and click the button. Fill in the task details and click Create.'
    },
    {
      question: 'How do I edit a task?',
      answer: 'Click on any task card to open the edit dialog. You can update the title, description, status, priority, and due date.'
    },
    {
      question: 'How do I change task status?',
      answer: 'Click on the status dropdown in a task card or open the task to change its status between Pending, In Progress, and Completed.'
    },
    {
      question: 'How do I filter tasks?',
      answer: 'Use the search bar and filter dropdowns on the Tasks page to filter by status, priority, or search term.'
    },
    {
      question: 'Can I view tasks on a calendar?',
      answer: 'Yes! Navigate to the Calendar page to see your tasks organized by date. Click on any date to see tasks due that day.'
    },
    {
      question: 'How do I view my productivity analytics?',
      answer: 'The Analytics page shows your task completion rates, status breakdown, and priority distribution.'
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-1">Get help and learn how to use TaskManager</p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="flex items-center gap-4 p-4">
            <Book className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">Documentation</h3>
              <p className="text-sm text-muted-foreground">Learn the basics</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="flex items-center gap-4 p-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">Community</h3>
              <p className="text-sm text-muted-foreground">Join discussions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="flex items-center gap-4 p-4">
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Get support</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Create new task</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + N</kbd>
            </div>
            <div className="flex justify-between">
              <span>Search tasks</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + K</kbd>
            </div>
            <div className="flex justify-between">
              <span>Toggle sidebar</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + B</kbd>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Version Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <a 
              href="#" 
              className="text-primary flex items-center gap-1 hover:underline"
            >
              View Changelog
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;