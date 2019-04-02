import React from 'react';
import FormField from '../widgets/FormFields/formFields';

import './signin.css';

class SignIn extends React.Component {
  state = {
    registerError: '',
    loading: false,
    formData: {
      email: {
        el: 'input',
        val: '',
        config: {
          name: 'email-input',
          type: 'email',
          placeholder: 'Enter Your Email',
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        vaidationMessage: '',
      },
      password: {
        el: 'input',
        val: '',
        config: {
          name: 'password-input',
          type: 'password',
          placeholder: 'Enter Your Password',
        },
        validation: {
          required: true,
          password: true
        },
        valid: false,
        touched: false,
        vaidationMessage: '',
      },
    }
  }

  updateForm = (el) => {
    const newFormData = {
      ...this.state.formData
    };

    const newEl = {
      ...newFormData[el.id]
    };

    newEl.val = el.event.target.value;
    newFormData[el.id] = newEl;

    this.setState({
      formData: newFormData,
    });
  }

  render() {
    const {email, password} = this.state.formData;
    
    return (
      <div className="login-container">
        <form>
          <h2>Login | Register</h2>
          <FormField 
            id={'email'}
            formData={email}
            change={(el) => this.updateForm(el)}
          />
          <FormField 
            id={'password'}
            formData={password}
            change={(el) => this.updateForm(el)}
          />
        </form>
      </div>
    )
  }
}

export default SignIn;