import { Button } from 'primereact/button';

interface AddReceiptButtonProps {
    isAddingReceipt: boolean;
    onAddReceipt: () => void;
}
const AddReceiptButton = ({ isAddingReceipt, onAddReceipt }: AddReceiptButtonProps) => (
    <Button
        icon={isAddingReceipt ? 'pi pi-minus' : 'pi pi-plus'}
        className="p-button-rounded p-button-outlined"
        onClick={onAddReceipt}
    />
)

export default AddReceiptButton;
