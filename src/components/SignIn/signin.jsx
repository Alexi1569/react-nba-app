import React from 'react';
import FormField from '../widgets/FormFields/formFields';
import { firebase } from '../../firebase';

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
          placeholder: 'Enter Your Email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      password: {
        el: 'input',
        val: '',
        config: {
          name: 'password-input',
          type: 'password',
          placeholder: 'Enter Your Password'
        },
        validation: {
          required: true,
          password: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };

  updateForm = el => {
    const newFormData = {
      ...this.state.formData
    };

    const newEl = {
      ...newFormData[el.id]
    };

    newEl.val = el.event.target.value;

    if (el.blur) {
      let validData = this.validate(newEl);
      newEl.valid = validData[0];
      newEl.validationMessage = validData[1];
    }

    newEl.touched = el.blur;
    newFormData[el.id] = newEl;

    this.setState({
      formData: newFormData
    });
  };

  validate = el => {
    let error = [true, ''];

    if (el.validation.email) {
      const valid = /\S+@\S+\.\S+/.test(el.val);
      const message = `${!valid ? 'Must be a valid email' : ''}`;
      error = !valid ? [valid, message] : error;
    }

    if (el.validation.password) {
      const valid = el.val.length >= 5;
      const message = `${!valid ? 'Must be greater than 5' : ''}`;
      error = !valid ? [valid, message] : error;
    }

    if (el.validation.required) {
      const valid = el.val.trim() !== '';
      const message = `${!valid ? 'This field is required' : ''}`;
      error = !valid ? [valid, message] : error;
    }

    return error;
  };

  submitForm = (e, type) => {
    e.preventDefault();

    if (type !== null) {
      let dataToSubmit = {};
      let formIsValid = true;

      for (let key in this.state.formData) {
        dataToSubmit[key] = this.state.formData[key].val;
      }

      for (let key in this.state.formData) {
        formIsValid = this.state.formData[key].valid && formIsValid;
      }

      if (formIsValid) {
        this.setState({
          loading: true,
          registerError: ''
        });

        if (type) {
          firebase
            .auth()
            .signInWithEmailAndPassword(
              dataToSubmit.email,
              dataToSubmit.password
            )
            .then(() => {
              this.props.history.push('/');
            })
            .catch(err => {
              this.setState({
                loading: false,
                registerError: err.message
              });
            });
        } else {
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              dataToSubmit.email,
              dataToSubmit.password
            )
            .then(() => {
              this.props.history.push('/');
            })
            .catch(err => {
              this.setState({
                loading: false,
                registerError: err.message
              });
            });
        }
      }
    }
  };

  submitButton = () => {
    return this.state.loading ? (
      'loading...'
    ) : (
      <div>
        <button onClick={e => this.submitForm(e, false)}>Register now</button>
        <button onClick={e => this.submitForm(e, true)}>Log in</button>
      </div>
    );
  };

  showError = () => {
    return this.state.registerError !== '' ? (
      <div className='login-container__error'>{this.state.registerError}</div>
    ) : (
      ''
    );
  };

  render() {
    const { email, password } = this.state.formData;

    return (
      <div className='login-container'>
        <form onSubmit={e => this.submitForm(e, null)}>
          <h2>Login | Register</h2>
          <FormField
            id={'email'}
            formData={email}
            change={el => this.updateForm(el)}
          />
          <FormField
            id={'password'}
            formData={password}
            change={el => this.updateForm(el)}
          />

          {this.submitButton()}
          {this.showError()}
        </form>
      </div>
    );
  }
}

export default SignIn;
