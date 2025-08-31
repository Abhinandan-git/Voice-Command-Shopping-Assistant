"use client"

import { AiOutlinePlus } from 'react-icons/ai'
import Modal from './Modal'
import { FormEvent, FormEventHandler, useState } from 'react';

const AddItem = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [newTaskValue, setNewTaskValue] = useState("");

	const handleSubmitNewItem: FormEventHandler<HTMLFormElement> = (evn) => {
		evn.preventDefault();
		setNewTaskValue("");
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
						<input value={newTaskValue} onChange={e => setNewTaskValue(e.target.value)} type="text" placeholder="Type here" className="input" />
						<button type="submit" className="btn">Submit</button>
					</div>
				</form>
			</Modal>
		</div>
	)
}

export default AddItem