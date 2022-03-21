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
import { db } from '../context/db';

type INewReceiptProps = {
    date: number,
    setIsAddingReceipt: (isAdding: boolean) => void
}

function NewReceipt({ date, setIsAddingReceipt }: INewReceiptProps) {
    /* const ipfsGateway = 'https://hub.textile.io'
     * const keyInfo: KeyInfo = {
     *     key: 'bo5w6wdrzlkstaadivtg77xd57y',
     *     secret: 'bv3jbmuebz4va3dw3f7iomutys6cxnghwxffonwa'
     * }
     * const keyInfoOptions: WithKeyInfoOptions = {
     *     debug: true
     * }

     * const [identity, setIdentity] = useState(null);
     * const [buckets, setBuckets] = useState(null);
     * const [bucketKey, setBucketKey] = useState(null);
     */
    /**
     * getIdentity uses a basic private key identity.
     * The user's identity will be cached client side. This is long
     * but ephemeral storage not sufficient for production apps.
     * 
     * Read more here:
     * https://docs.textile.io/tutorials/hub/libp2p-identities/
     */
    /* async function getIdentity(): Promise<PrivateKey> {
     *     try {
     *         var storedIdent = localStorage.getItem("identity")
     *         if (storedIdent === null) {
     *             throw new Error('No identity')
     *         }
     *         const restored = PrivateKey.fromString(storedIdent)
     *         return restored
     *     }
     *     catch (e) {
     *         try {
     *             const ident = PrivateKey.fromRandom()
     *             const identityString = ident.toString()
     *             return ident
     *         } catch (err) {
     *             return err.message
     *         }
     *     }
     * } */

    /**
     * getBucketKey will create a new Buckets client with the UserAuth
     * and then open our custom bucket named, 'io.textile.dropzone'
     */
    /* async function getBucketKey(identity) {
     *     console.log(identity)
     *     if (!identity) {
     *         throw new Error('Identity not set')
     *     }
     *     console.log(keyInfo, keyInfoOptions)
     *     const bucks = await Buckets.withKeyInfo(keyInfo, keyInfoOptions);
     *     // Authorize the user and your insecure keys with getToken
     *     await bucks.getToken(identity)
     *     const bucket = await bucks.getOrCreate('kakeibo')
     *     if (!bucket.root) {
     *         throw new Error('Failed to open bucket')
     *     }
     *     return {buckets: bucks, bucketKey: bucket.root.key};
     * } */

    useEffect(() => {
        /* const initialize = async () => {
         *     const ident = await getIdentity();
         *     setIdentity(ident);

         *     // get their photo bucket
         *     const bucketData = await getBucketKey(ident)
         *     setBuckets(bucketData.buckets);
         *     setBucketKey(bucketData.bucketKey);
         *     console.log(bucketData.buckets, bucketData.bucketKey)
         *     console.log(buckets, bucketKey)
         * }
         * initialize(); */
    }, [])
  // handleNewFile = async (file: File) => {
      /* const preview = {
       *   maxWidth: 800,
       *   maxHeight: 800
       * }
       * const thumb = {
       *   maxWidth: 200,
       *   maxHeight: 200
       * }
       * if (!this.state.buckets || !this.state.bucketKey) {
       *   console.error('No bucket client or root key')
       *   return
       * }
       * const imageSchema: {[key: string]: any} = {}
       * const now = new Date().getTime()
       * imageSchema['date'] = now
       * imageSchema['name'] = `${file.name}`
       * const filename = `${now}_${file.name}`
       * 
       * imageSchema['original'] = await this.processAndStore(file, 'originals/', filename)
       * 
       * imageSchema['preview'] = await this.processAndStore(file, 'previews/', filename, preview)

       * imageSchema['thumb'] = await this.processAndStore(file, 'thumbs/', filename, thumb)

       * const metadata = Buffer.from(JSON.stringify(imageSchema, null, 2))
       * const metaname = `${now}_${file.name}.json`
       * const path = `metadata/${metaname}`
       * await this.state.buckets.pushPath(this.state.bucketKey, path, metadata)

       * const photo = this.state.photos.length > 1 ? imageSchema['preview'] : imageSchema['original']

       * this.setState({ 
       *   index: {
       *     ...this.state.index,
       *     paths: [...this.state.index.paths, path]
       *   },
       *   photos: [
       *     ...this.state.photos,
       *     {
       *       src: `${this.ipfsGateway}/ipfs/${photo.cid}`,
       *       width: photo.width,
       *       height: photo.height,
       *       key: photo.name,
       *     }
       *   ]
       * })
         } */
    const [price, setPrice] = useState(0);
    // const { user, gun, sea, login, logout, isLoggedIn, ...rest } = useAuth();
    const [category, setCategory] = useState(expenditureTypes[0]);
    const [imageName, setImageName] = useState('');
    const [imageBuffer, setImageBuffer] = useState(new Uint8Array());
    const [imageType, setImageType] = useState('');
    const [imageSize, setImageSize] = useState(0);
    const labeledCategories = expenditureTypes.map(e => Object.assign({}, {label: e, value: e }));

    const readFile = (file: File): Promise<ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.addEventListener('loadend', e => resolve(e!.target!.result as ArrayBuffer));
            reader.addEventListener('error', reject);
            reader.readAsArrayBuffer(file);
        });
    }

    const onSelect = async (event: any) => {
        console.log(event.files)
        const files = Array.from(event.files);
        const image = files[0] as File;
        const imageContent = await readFile(image);
        if (!imageContent) {
            console.log('Failed reading file ', files[0])
            return;
        }
        const buffer = new Uint8Array(imageContent);
        console.log('buffer: ', buffer);
        setImageName(image.name);
        setImageBuffer(buffer);
        console.log('SET IMAGE TYPE ', image.type, image)
        setImageType(image.type);
        setImageSize(image.size);
    }

    const onSave = async (e: any) => {
        console.log('IMAGE BUFFER TYPE AND SIZE ', imageType, imageSize)
        const receiptImageId = await db.receiptImages.add({
            name: imageName,
            content: imageBuffer,
            imageType: imageType,
            imageSize: imageSize,
            dbType: 'indexedDB'
        });

        const receiptId = await db.receipts.add({
            date,
            category,
            amount: price,
            userId: 0,
            receiptImageId: receiptImageId as number,
            dbType: 'indexedDB'
        });
        // gun.get('receipts').get('2022-03').get('1235').put({ cid: '1235', name: 'test 3', amount: '309'})
        // gun.get('receipts').get('2022-03').get('456').put({ cid: '124', name: 'test2', amount: '123'})
        // const todoKeyArray = gun.get('receipts').path('2022-03').map().once(p => console.log('path', p));
        // console.log('arrya', todoKeyArray)
        // console.log('josn ', gun.path('receipts/2022-03').map().once(res => console.log('res ', res)))
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
