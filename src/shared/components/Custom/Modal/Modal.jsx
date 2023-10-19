import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from 'flowbite-react'
import Context from '#context'
import React, { Component } from 'react'

// TODO: Vereinfachen, wie bei der Loadingbar (Mehrere Objekt oriented!)
// DOKU:

export class ModalConfirm extends Component {
	static contextType = Context
	componentDidMount() {
		this.context.openModal(true)
	}
	componentWillUnmount() {
		this.context.openModal(false)
	}
	render() {
		const { t } = this.context
		const { children, icon, footer, header } = this.props
		return (
			<Modal
				className="dark:text-white backdrop-blur"
				dismissible
				show={this.props.show}
				onClose={this.props.onClose.bind(this)}
			>
				{header && <Modal.Header>{header}</Modal.Header>}
				<Modal.Body>
					<div className="-m-2 p-2 text-center dark:text-white max-h-[calc(100vh-17rem)] overflow-auto">
						{icon && (
							<FontAwesomeIcon
								icon={icon}
								className="mx-auto mb-4 h-14 w-14"
							/>
						)}
						<div className="text-lg font-normal">{children}</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="flex-col">
					{footer && <div className="mb-4">{footer}</div>}
					<div className="flex justify-center w-full gap-4">
						<Button
							color="success"
							onClick={this.props.saveModal.bind(this)}
						>
							{this.props.buttonConfirm
								? this.props.buttonConfirm
								: t('all.confirm')}
						</Button>
						<Button
							color="failure"
							onClick={
								this.props.denyModal
									? this.props.denyModal.bind(this)
									: this.props.onClose.bind(this)
							}
						>
							{this.props.buttonCancel
								? this.props.buttonCancel
								: t('all.cancel')}
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		)
	}
}

export default class ModalDefault extends Component {
	static contextType = Context
	componentDidMount() {
		this.context.openModal(true)
	}
	componentWillUnmount() {
		this.context.openModal(false)
	}
	render() {
		return (
			<Modal
				className="dark:text-white backdrop-blur"
				dismissible
				show={this.props.show}
				onClose={this.props.onClose.bind(this)}
			>
				{this.props.header && (
					<Modal.Header>{this.props.header}</Modal.Header>
				)}
				<Modal.Body className="max-h-[calc(100vh-17rem)] overflow-auto">
					{this.props.children}
				</Modal.Body>
				{this.props.footer && (
					<Modal.Footer>{this.props.footer}</Modal.Footer>
				)}
			</Modal>
		)
	}
}
