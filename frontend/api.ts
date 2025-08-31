import { IItem } from "./types/items";

const baseUrl = 'http://localhost:8000';

export const getAllItems = async (user_id: string): Promise<IItem[]> => {
	const res = await fetch(`${baseUrl}/list?${user_id}`);
	const items = await res.json();
	return items;
}

export const addTodo = async (user_id: string) => {
}