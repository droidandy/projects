
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Loader } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';


class RateBank extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    note: PropTypes.string.isRequired,
    filesToUpload: PropTypes.array.isRequired,
    sending: PropTypes.bool.isRequired,
    changeNote: PropTypes.func.isRequired,
    onDropFiles: PropTypes.func.isRequired,
    updateFiles: PropTypes.func.isRequired,
    sendToBank: PropTypes.func.isRequired,
    quoteType: PropTypes.string.isRequired,
  };
  getSize(b) {
    const fsizekb = b / 1024;
    const fsizemb = fsizekb / 1024;
    const fsizegb = fsizemb / 1024;
    const fsizetb = fsizegb / 1024;
    let fsize;
    if (fsizekb <= 100) {
      fsize = `${fsizekb.toFixed(2)} KB`;
    } else if (fsizekb >= 100 && fsizemb <= 100) {
      fsize = `${fsizemb.toFixed(2)} MB`;
    } else if (fsizemb >= 100 && fsizegb < 1000) {
      fsize = `${fsizegb.toFixed(2)} GB`;
    } else {
      fsize = `${fsizetb.toFixed(2)} TB`;
    }
    return fsize;
  }
  render() {
    const { note, changeNote, onDropFiles, filesToUpload, updateFiles, sending, sendToBank, quoteType } = this.props;
    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Field width="8">
              <label htmlFor="activity-type" className="nowrap">Ratebank amount requested</label>
              <b>-</b>
            </Form.Field>
          </Form.Group>
          <Form.TextArea
            width="13"
            rows={5}
            label="Add a note:"
            value={note}
            onChange={changeNote}
          />
        </Form>
        <div className="prequoted-bank__zone-holder">
          <p><b>Add Attachments</b></p>
          <Dropzone
            // accept=".xls, .xlsx"
            className="upload-zone prequoted-bank__zone"
            name="uploadQuoteByProduct"
            files={[]} maxSize={5242880}
            onDrop={onDropFiles}
          >
            <p className="upload-zone__caption">Drag &amp; Drop or...</p>
            <div className="upload-zone__button">Upload File</div>
          </Dropzone>
          {filesToUpload && filesToUpload.map((item, index) =>
            (<p key={index}>Loaded file: <b>{item.name || ''}
            ({this.getSize(item.size)})</b>
              <a
                href="" onClick={(e) => {
                  e.preventDefault();
                  const one = [...filesToUpload].splice(0, index);
                  const two = [...filesToUpload].splice(index + 1);
                  const newFilesArray = [...one, ...two];
                  updateFiles(newFilesArray);
                }}
              >
                Remove
              </a></p>))
          }
        </div>
        <div className="button-line">
          <Button disabled={sending} primary size="big" fluid className="send-button" onClick={() => sendToBank({ note, files: filesToUpload, quoteType })}>Send Request</Button>
          <Loader inline active={sending} />
        </div>
        <div className="send-message">
          <div className="send-message-title">What happens next:</div>
          <ul>
            <li>Your manager will receive a rate bank request email</li>
            <li>The SAR, SAE, business analyst and rater will all be included on the email</li>
            <li>If approved, you can update the quoted rates by revisiting the Upload Quote section</li>
          </ul>
        </div>
      </div>
    );
  }
  }

export default RateBank;
