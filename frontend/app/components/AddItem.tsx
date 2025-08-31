"use client"

import { AiOutlinePlus } from 'react-icons/ai'
import Modal from './Modal'
import { FormEvent, FormEventHandler, useState } from 'react';
import { addItem } from '@/api';

const AddItem = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [newItemValue, setNewItemValue] = useState("");

	const handleSubmitNewItem: FormEventHandler<HTMLFormElement> = async (evn) => {
		evn.preventDefault();
		await addItem(document.cookie, newItemValue);
		setNewItemValue("");
		setModalOpen(false);
	}

	return (
		<div>
			<button className="btn btn-primary w-full" onClick={() => setModalOpen(true)}>
				Add New Item <AiOutlinePlus className="ml-2" size={18} />
			</button>

			<Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
				<form onSubmit={handleSubmitNewItem}>
					<h3 className="font-bold text-lg">Add new item</h3>
					<div className="modal-action">
						<input value={newItemValue} onChange={e => setNewItemValue(e.target.value)} type="text" placeholder="Type here" className="input w-full" />
						<button type="submit" className="btn">Submit</button>
					</div>
				</form>
			</Modal>
		</div>
	)
}

export default AddItem