import styles from './SignUpForm.module.css'
import { useContext, useRef } from 'react'
import Button from '../UI/Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import BottomFormPopup from '../UI/ButtonFormPopup'
import InputField from '../UI/InputField'
import toast from '../UI/Toast'
import PasswordField from '../UI/PasswordField'
import { signUp } from '../../utils/auth'
import loggedInContext from '../../utils/Contexts/loggedInContext'

export interface ISignUpForm {}

export default function SignUpForm(props: ISignUpForm) {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [errorShow, setErrorShow] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { setIsLoggedIn } = useContext(loggedInContext)

  const history = useHistory()
  const signUpHandler = async (e: any) => {
    e.preventDefault()
    if (usernameRef.current?.value.trim().length === 0) {
      setErrorMessage('Username cannot be empty')
      setErrorShow(true)
    } else if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      setErrorMessage("Your passwords don't match")
      setErrorShow(true)
    } else {
      setErrorShow(false)
      setErrorMessage('')

      try {
        await signUp(usernameRef, passwordRef)
        toast('👍 Account Successfully created')
        setIsLoggedIn(true)
        history.push(sessionStorage.getItem('lastPage') ?? '/')
      } catch (e: any) {
        const { msg } = e.data
        setErrorMessage(msg)
        setErrorShow(true)
      }
    }
  }
  return (
    <form className={styles['form']}>
      <div className={styles['pair']}>
        <label htmlFor='username'>Username</label>
        <InputField type='text' name='username' id='username' ref={usernameRef} />
      </div>
      <div className={styles['pair']}>
        <label htmlFor='password'>Password</label>
        <PasswordField ref={passwordRef} />
      </div>
      <div className={styles['pair']}>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <PasswordField ref={confirmPasswordRef} disabled />
      </div>
      <BottomFormPopup show={errorShow} message={errorMessage}>
        <Button text='Create account' onClick={signUpHandler} />
        <div className={styles['register-text']}>
          <p>Already have an account?</p>
          <p>
            Login by clicking <Link to='/login'> here</Link>
          </p>
        </div>
      </BottomFormPopup>
    </form>
  )
}
