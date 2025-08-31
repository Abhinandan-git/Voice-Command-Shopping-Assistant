import { IItem } from "./types/items";

const baseUrl = 'https://voice-command-shopping-assistant-jr0l.onrender.com';

export const getAllItems = async (user_id: string): Promise<IItem[]> => {
	const res = await fetch(`${baseUrl}/list?${user_id}`);
	const items = await res.json();
	return items;
}

export const addItem = async (user_id: string, item: string): Promise<IItem> => {
	const res = await fetch(`${baseUrl}/list?${user_id}&item_id=${item}`, {
		method: "POST", headers: {
			"Content-Type": "application/json"
		}, body: JSON.stringify(item)
	})
	const newItem = await res.json();
	return newItem;
}