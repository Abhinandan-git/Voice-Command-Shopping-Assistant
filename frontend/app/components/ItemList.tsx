import { IItem } from "@/types/items"
import React from "react"
import Item from "./Item"

interface ItemsListProps {
	items: IItem[];
}

const ItemList: React.FC<ItemsListProps> = ({ items }) => {
	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
			<table className="table">
				<thead>
					<tr>
						<th>Item</th>
						<th>Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<Item key={item.id} item={item} />
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ItemList