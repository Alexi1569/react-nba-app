import React, { Component } from 'react';
import FormField from '../widgets/FormFields/formFields';
import './dashboard.css';
import { firebase, firebaseTeams, firebaseArticles } from '../../firebase';
import Uploader from '../widgets/FileUploader/fileUploader';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

class Dashboard extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    postError: '',
    loading: false,
    formData: {
      author: {
        el: 'input',
        val: '',
        config: {
          name: 'author-input',
          type: 'text',
          placeholder: 'Enter Your name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      title: {
        el: 'input',
        val: '',
        config: {
          name: 'title-input',
          type: 'text',
          placeholder: 'Enter the title'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      body: {
        element: 'text-editor',
        val: '',
        valid: true
      },
      image: {
        element: 'image',
        val: '',
        valid: true
      },
      team: {
        el: 'select',
        val: '',
        config: {
          name: 'teams-input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };

  updateForm = (el, content = '') => {
    const newFormData = {
      ...this.state.formData
    };

    const newEl = {
      ...newFormData[el.id]
    };

    if (content === '') {
      newEl.val = el.event.target.value;
    } else {
      newEl.val = content;
    }

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

    if (el.validation.required) {
      const valid = el.val.trim() !== '';
      const message = `${!valid ? 'This field is required' : ''}`;
      error = !valid ? [valid, message] : error;
    }

    return error;
  };

  submitForm = e => {
    e.preventDefault();

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
        postError: ''
      });

      firebaseArticles
        .orderByChild('id')
        .limitToLast(1)
        .once('value')
        .then(snapshot => {
          let articleId = null;
          snapshot.forEach(item => {
            articleId = item.val().id;
          });

          dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP;
          dataToSubmit['id'] = articleId + 1;
          dataToSubmit['team'] = parseInt(dataToSubmit['team'], 10);

          firebaseArticles
            .push(dataToSubmit)
            .then(article => {
              this.props.history.push(`/articles/${article.key}`);
            })
            .catch(err => {
              this.setState({
                postError: err.message
              });
            });
        });
    } else {
      this.setState({
        postError: 'Something went wrong'
      });
    }
  };

  submitButton = () => {
    return this.state.loading ? (
      'loading...'
    ) : (
      <div>
        <button type='submit'>Add post</button>
      </div>
    );
  };

  showError = () => {
    return this.state.postError !== '' ? (
      <div className='login-container__error'>{this.state.postError}</div>
    ) : (
      ''
    );
  };

  onEditorStateChange = editorState => {
    let contentState = editorState.getCurrentContent();
    let html = stateToHTML(contentState);

    this.updateForm(
      {
        id: 'body'
      },
      html
    );

    this.setState({
      editorState
    });
  };

  loadTeams = () => {
    firebaseTeams.once('value').then(snapshot => {
      let team = [];

      snapshot.forEach(item => {
        team.push({
          id: item.val().teamId,
          name: item.val().city
        });
      });

      const newFormData = {
        ...this.state.formData
      };
      const newElement = { ...newFormData['team'] };

      newElement.config.options = [...team];
      newFormData['team'] = newElement;

      this.setState({
        formData: newFormData
      });
    });
  };

  componentDidMount() {
    this.loadTeams();
  }

  storeFilename = filename => {
    this.updateForm({ id: 'image' }, filename);
  };

  render() {
    return (
      <div className='post-container'>
        <form onSubmit={this.submitForm}>
          <h2>Add post</h2>

          <Uploader filename={filename => this.storeFilename(filename)} />

          <FormField
            id={'author'}
            formData={this.state.formData.author}
            change={el => this.updateForm(el)}
          />

          <FormField
            id={'title'}
            formData={this.state.formData.title}
            change={el => this.updateForm(el)}
          />

          <Editor
            editorState={this.state.editorState}
            wrapperClassName='editor-wrap'
            editorClassName='editor-content'
            onEditorStateChange={this.onEditorStateChange}
          />

          <FormField
            id={'team'}
            formData={this.state.formData.team}
            change={el => this.updateForm(el)}
          />

          {this.submitButton()}
          {this.showError()}
        </form>
      </div>
    );
  }
}

export default Dashboard;
