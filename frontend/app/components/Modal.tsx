interface ModalProps {
	modalOpen: boolean;
	setModalOpen: (open: boolean) => boolean | void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ modalOpen, setModalOpen, children }) => {
	return (
		<>
			<dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
				<div className="modal-box">
					{children}
				</div>
				<form method="dialog" className="modal-backdrop">
					<button onClick={() => setModalOpen(false)}>close</button>
				</form>
			</dialog>
		</>
	)
}

export default Modal