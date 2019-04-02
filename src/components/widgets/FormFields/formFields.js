import React from 'react';
import './formFields.css';

const FormFields = ({formData, change, id}) => {
  const renderTemplate = () => {
    let formTemplate = null;

    switch(formData.el) {
      case 'input':
        formTemplate = (
          <div>
            <input 
              {...formData.config}
              value={formData.val}
              onChange={(event) => change({
                event,
                id,
                blur: false,
              })}
              onBlur={(event) => change({
                event,
                id,
                blur: true,
              })}
            />
          </div>
        );
        break;

      default:
        formTemplate = null;
    }
    return formTemplate;
  }

  return (
    <div>
      {renderTemplate()}
    </div>
  );
}

export default FormFields;