import styles from "./StepAvatar.module.css"
import React, {useEffect, useState} from 'react'
import Card from "../../../components/shared/card/Card"
import Button from "../../../components/shared/button/Button"
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activate-slice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/auth-slice";
import Loader from "../../../components/shared/Loader/Loader";



const StepAvatar = ({onNext}) => {

    const {name, avatar} = useSelector((state) => state.activate)
    const dispatch = useDispatch();

    const [image, setImage] = useState("/images/avatar.png")
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [error, setError] = useState("");

    const iconStyle = {
        fontSize : "35px"
    }

    const captureImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result)
            dispatch(setAvatar(reader.result))
        }
    }

    const submit = async () => {
        if(!name || !avatar){
            setError("Please choose your avatar")
            return;
        }
        setLoading(true);
        try {
            const {data} = await activate({name, avatar})
            if(data.auth){
                if(!mounted){
                    dispatch(setAuth(data));
                }
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            setMounted(true);
        }
    }, [])


    if(loading) return <Loader message="Activation in progress...." />

  return (
    <div className="cardWrapper">
        <Card title={`Okay, ${name}!`} icon={<PermIdentityIcon style={iconStyle} />} >
            <p className={styles.subHeading}>
                How's this photo?
            </p>
            <div className={styles.avatarWrapper}>
                <img className={styles.avatar} src={image} alt="avatar" />
            </div>
            <div>
                <input onChange={captureImage} id="avatarInput" className={styles.avatarInput} type="file" />
                <label className={styles.avatarLabel} htmlFor="avatarInput">Choose a different photo</label>
            </div>
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} text="Next" />
                </div>
                {error && <p style={{color : "red", textAlign : "center", fontSize : "12px", marginTop : "15px"}}>{error}</p>}
            </div>
        </Card>
    </div>
  )
}

export default StepAvatar