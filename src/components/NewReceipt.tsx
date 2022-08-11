import react, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
// import { useAuth } from '@altrx/gundb-react-auth';
import { expenditureTypes, expenditureColors } from '../utils/categories'
// @ts-ignore
import browserImageSize from 'browser-image-size'
// @ts-ignore
import { readAndCompressImage } from 'browser-image-resizer'
import { Buckets, PushPathResult, KeyInfo, PrivateKey, WithKeyInfoOptions } from '@textile/hub'
import { useHouseManager } from '../context/db';
import { web3 } from '../context/crypto';
import { getHash } from '../utils/key';

type INewReceiptProps = {
    date: number,
    setIsAddingReceipt: (isAdding: boolean) => void
}

function NewReceipt({ date, setIsAddingReceipt }: INewReceiptProps) {
    const { db } = useHouseManager();
    const [price, setPrice] = useState<number | null>(null);
    const [category, setCategory] = useState(expenditureTypes[0]);
    const [imageName, setImageName] = useState('');
    const [imageBuffer, setImageBuffer] = useState(new Uint8Array());
    const [imageType, setImageType] = useState('');
    const [imageSize, setImageSize] = useState(0);
    const [accounts, setAccounts] = useState<string[]>([]);
    const labeledCategories = expenditureTypes.map(e => Object.assign({}, {label: e, value: e }));

    useEffect(() => {
        const getProviderAddress = async () => {
            try {
                const retrievedAccounts = await web3.eth.getAccounts();
                setAccounts(retrievedAccounts);
            } catch (error) {
                console.log('[New Receipts] getAccounts: ', error)
            }
        }

        getProviderAddress();
    }, []);


    const readFile = (file: File): Promise<ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.addEventListener('loadend', e => resolve(e!.target!.result as ArrayBuffer));
            reader.addEventListener('error', reject);
            reader.readAsArrayBuffer(file);
        });
    }

    const onSelect = async (event: any) => {
        const files = Array.from(event.files);
        const image = files[0] as File;
        const imageContent = await readFile(image);
        if (!imageContent) {
            console.log('Failed reading file ', files[0])
            return;
        }
        const buffer = new Uint8Array(imageContent);
        setImageName(image.name);
        setImageBuffer(buffer);
        setImageType(image.type);
        setImageSize(image.size);
    }

    const onSave = async (e: any) => {
        if (price === null) return;
        const targetReceipt = {
            date,
            category,
            amount: price,
            userAddress: accounts.length > 0 ? accounts[0] : '',
            imageName,
            imageType
        }

        const hash = getHash(targetReceipt);
        try {
            const receiptId = await db.receipts.add({
                ...targetReceipt,
                imageBuffer: imageBuffer,
                hash,
            });
        } catch (err) {
            console.log(err)
            alert(err)
            return;
        }
        setIsAddingReceipt(false);

    };
    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <FileUpload
                    accept="image/png, image/jpeg, image/bmp"
                    onSelect={onSelect}
                />
            </div>
            <div className="col-12">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-sort-alpha-down"></i>
                    </span>
                    <Dropdown
                        value={category}
                        options={labeledCategories}
                        onChange={(e) => {
                            if (e.value)
                                setCategory(e.value) }
                        }
                        placeholder="Category" />
                </div>
            </div>
            <div className="col-12">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-dollar"></i>
                    </span>
                    <InputNumber
                        inputId="price"
                        placeholder="Price"
                        value={price}
                        onValueChange={e=> {
                        if (e.value) setPrice(e.value)
                        }
                        } />
                </div>
            </div>
            <div className="row flex justify-content-center">
                <div className="12 flex align-items-center justify-content-center">
                    <Button
                        icon="pi pi-save"
                        className="p-button-rounded p-button-primary"
                        onClick={onSave}
                    />
                </div>
            </div>
        </div>
    );
}


export default NewReceipt;
