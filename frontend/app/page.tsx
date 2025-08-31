'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Define the structure of a shopping item
interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

// A simple function to guess the category of an item
const getCategory = (item: string): string => {
  const lowerItem = item.toLowerCase();
  if (/\b(milk|cheese|yogurt|butter)\b/.test(lowerItem)) return 'Dairy';
  if (/\b(apple|banana|orange|berries|lettuce|carrot)\b/.test(lowerItem)) return 'Produce';
  if (/\b(bread|baguette|croissant)\b/.test(lowerItem)) return 'Bakery';
  if (/\b(chicken|beef|fish)\b/.test(lowerItem)) return 'Meat';
  if (/\b(cereal|chips|cookies|snacks)\b/.test(lowerItem)) return 'Snacks';
  return 'General';
};

// Main component for the Home Page
export default function HomePage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Click the mic and start talking.');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Fetch initial shopping list from the server
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Failed to fetch items.');
      const data: ShoppingItem[] = await response.json();
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  // Setup the Web Speech API for voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('Sorry, your browser does not support voice recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback('Listening...');
    };

    recognition.onend = () => {
      setIsListening(false);
      setFeedback('Click the mic and start talking.');
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      parseCommand(currentTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  // Function to add an item via API call
  const handleAddItem = async (name: string, quantity: number) => {
    try {
      const newItem: Omit<ShoppingItem, 'id'> = {
        name,
        quantity,
        category: getCategory(name),
      };
      
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Failed to add item.');
      
      setFeedback(`Added ${quantity} ${name}.`);
      fetchItems(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Function to remove an item via API call
  const handleRemoveItem = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item.');
      
      setFeedback(`Removed ${name}.`);
      fetchItems(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // Simple NLP to parse voice commands using regex
  const parseCommand = (command: string) => {
    const commandLower = command.toLowerCase();

    // Regex for adding items (e.g., "Add 5 apples")
    const addRegex = /^(add|buy|get)\s*(\d+)?\s*(.+)/i;
    const addMatch = commandLower.match(addRegex);

    if (addMatch) {
      const quantity = parseInt(addMatch[2] || '1', 10);
      const itemName = addMatch[3].replace(/s$/, ''); // Simple plural removal
      handleAddItem(itemName, quantity);
      return;
    }
    
    // Regex for removing items (e.g., "Remove milk from the list")
    const removeRegex = /^remove\s*(.+?)(?:\s+from my list)?$/i;
    const removeMatch = commandLower.match(removeRegex);

    if (removeMatch) {
        const itemName = removeMatch[1].trim();
        const itemToRemove = items.find(item => item.name.toLowerCase() === itemName);
        if (itemToRemove) {
            handleRemoveItem(itemToRemove.id, itemToRemove.name);
        } else {
            setFeedback(`Could not find "${itemName}" in your list.`);
        }
        return;
    }

    setFeedback(`Sorry, I didn't understand "${command}".`);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };
  
  // Group items by category for rendering
  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Assistant</h1>
          <p className="text-gray-600 mt-2">{feedback}</p>
        </header>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}
        {transcript && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md mb-4">You said: "{transcript}"</div>}

        <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading your list...</p>
            </div>
          ) : Object.keys(groupedItems).length === 0 ? (
            <p className="text-center text-gray-500">Your shopping list is empty.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold border-b pb-2 mb-3 text-gray-700">{category}</h2>
                  <ul className="space-y-2">
                    {itemsInCategory.map(item => (
                      <li key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <span className="capitalize">{item.name} - <span className="font-medium">{item.quantity}</span></span>
                        <button 
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 font-bold text-xl"
                          aria-label={`Remove ${item.name}`}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Command Button */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
              ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zM5 4a5 5 0 00-5 5v1a5 5 0 005 5h10a5 5 0 005-5V9a5 5 0 00-5-5H5z" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}