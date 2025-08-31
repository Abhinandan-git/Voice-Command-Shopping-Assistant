import React from 'react'
import AddItem from './components/AddItem'
import ItemList from './components/ItemList'
import { getAllItems } from '@/api'

const HomePage = async () => {
  const items = await getAllItems("user_id=68b183abd0cdc2510cdd8693");
  
  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col">
        <h1 className="text-2xl font-bold">Voice Command Shopping Assistant</h1>
        <AddItem />
      </div>
      <ItemList items={items} />
    </main>
  )
}

export default HomePage