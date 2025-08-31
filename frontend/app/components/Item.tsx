import { IItem } from "@/types/items"

interface ItemsProps {
	item: IItem;
}

const Item: React.FC<ItemsProps> = ({ item }) => {
	return (
		<tr key={item.id}>
			<td>{item.name}</td>
			<td>{item.price}</td>
			<td></td>
		</tr>
	)
}

export default Item