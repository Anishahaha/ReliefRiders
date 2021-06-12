/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from 'react';
import './verify_otp.css'
import InputField from '../../../global_ui/input'
import { AuthContext } from '../../../context/auth/authProvider';
import Spinner from '../../../global_ui/spinner';
import { useHistory, useLocation } from 'react-router';
import Logo from '../../../global_ui/logo';
import { verify } from '../../../context/auth/authOperations';
import useModal from '../error_dialog/useerr';
import Modal from '../error_dialog/err_dialog';
const VerifyOTP = () => {
    const [otp, setOtp] = useState('')
    const [errorMsg, setError] = useState({
        error: 'Please enter OTP',
        showError: false
    })
    const {isShowing, toggle} = useModal();
    const route = useHistory()
    const {state:{isRequester,authType,user}} = useLocation()
    const { dispatch, loading,error } = useContext(AuthContext)
    
    useEffect(()=>{
        dispatch({
            type:"ISRIDER",payload:null
        })
        
    },[])
    const submit =  () => {
        setError({ ...errorMsg, showError: true })
        if (!errorMsg.error) {
           const res = verify(dispatch,otp,authType,isRequester,user)
                              res.then((r)=>{
            if(r == 1){
                window.location.reload()

                route.push(`/home/${isRequester?"requester":'rider'}`)
                
            }else{
             toggle()
            }
           })
        }
        
    }
    const validateOTP = (otp) => {
        if (otp.length == 0) {
            setError({ ...errorMsg, error: "Please enter OTP" })

        }
        else if (otp.length < 6) {
            setError({ ...errorMsg, error: "OTP must contain 6 digits" })
        } else {
            setError({ ...errorMsg, error: "" })

        }
        setOtp(otp)
    }

    const goBack = () => {
        dispatch(
            {
                type: "SHOWFORM",
                action: null
            }
        )
    }

    return (
        <div className="otp-container">
            <Logo></Logo>
            <Modal
        isShowing={isShowing}
        hide={toggle}
        msg={error}
      />
            <span style={{ textAlign: 'center', marginBottom: 0.3 + 'em' }} >You will get an OTP via SMS</span>
            <InputField error={errorMsg.showError ? errorMsg.error : ""} textAlign="center" placeholder="Enter OTP" type="number" onChange={(e) => validateOTP(e.target.value)} />
            <span>Still haven't received the OTP ? <a onClick={() => console.log("fff")} className="send-otp-btn" >Resend OTP</a> </span>
            <div style={{ height: 5 + 'rem' }} ></div>
            {loading ?
                <Spinner radius="2" /> : <button onClick={submit} className="verify-btn" >Verify</button>}

            <p style={{ textAlign: 'center', marginBottom: 0.3 + 'em' }} >Entered wrong details <button onClick={goBack} className="go-back-reg" >Go back</button>  </p>
        </div >
    );
}

export default VerifyOTP;