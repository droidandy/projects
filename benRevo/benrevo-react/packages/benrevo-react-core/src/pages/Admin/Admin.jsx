import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Segment, Header, Form, Button, Message, Loader } from 'semantic-ui-react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Helmet from 'react-helmet';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import options from './toolbarOptions';

class Admin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    configLoaded: PropTypes.bool.isRequired,
    disclosure: PropTypes.object.isRequired,
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    getConfig: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.changeEdit = this.changeEdit.bind(this);
    this.state = {
      edit: false,
      editorState: EditorState.createEmpty(),
    };
  }

  componentWillMount() {
    this.props.getConfig();
    if ((!this.props.disclosure.data || !this.props.disclosure.modifyBy) && this.props.configLoaded) {
      this.setState({ edit: true });
    }
    this.setEditorData(this.props.disclosure);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.configLoaded !== this.props.configLoaded && !nextProps.disclosure.data) {
      this.setState({ edit: true });
    }
  }

  onEditorStateChange(editorState) {
    const { changeForm } = this.props;
    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    changeForm(text);
    this.setState({
      editorState,
    });
  }

  setEditorData(disclosure) {
    if (disclosure && disclosure.data) {
      const contentBlock = htmlToDraft(disclosure.data);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }


  changeEdit() {
    const { disclosure } = this.props;
    console.log('disclosure', disclosure, 'state', this.state);
    if (!this.state.edit) {
      this.setEditorData(disclosure);
    }
    this.setState({ edit: !this.state.edit });
  }

  decodeHtml() {
    const { disclosure } = this.props;
    if (disclosure && disclosure.data) {
      const innerHtml = disclosure.data;
      const txt = document.createElement('textarea');
      txt.innerHTML = innerHtml;
      return { __html: DOMPurify.sanitize(txt.value) };
    }
    return { __html: '<div></div>' };
  }

  render() {
    const { loading, disclosure, formSubmit, cancelForm } = this.props;
    const { editorState } = this.state;
    return (
      <div className="admin">
        <Helmet
          title="Admin"
          meta={[
            { name: 'description', content: 'Description of Admin' },
          ]}
        />
        <Grid stackable container className="section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={13}>
                  <Header as="h1" className="page-heading">Broker Administration</Header>
                  <p>
                    Use the below input field to insert language to be included with every RFP (i.e., compensation disclosure, confidentiality notice, quote requirements, etc.)
                  </p>
                  <Message warning color="grey">
                    <Message.Header><b>IMPORTANT:</b> The information included below will be automatically included with every RFP. You should consult with your site administrator prior to making any changes.</Message.Header>
                  </Message>
                  <Loader indeterminate active={(!disclosure.data || !disclosure.modifyBy) && loading} size="big" />
                  { this.state.edit && !loading &&
                    <div>
                      <Form>
                        <Editor
                          editorStyle = {{lineHeight: '75% '}}
                          editorState={editorState}
                          toolbarClassName="adminEditorToolbar"
                          wrapperClassName="adminEditorWrapper"
                          editorClassName="adminEditor"
                          toolbar={options}
                          onEditorStateChange={this.onEditorStateChange}
                        />
                      </Form>
                      <Grid textAlign="right">
                        <Grid.Row textAlign="right">
                          <Grid.Column width={7} />
                          <Grid.Column width={4}>
                            <Button
                              fluid
                              disabled={!disclosure.data}
                              onClick={() => {
                                this.changeEdit();
                                cancelForm();
                              }}
                              basic
                              size="big"
                            >Cancel</Button>
                          </Grid.Column>
                          <Grid.Column width={5}>
                            <Button
                              fluid
                              disabled={!disclosure.data}
                              onClick={() => {
                                this.changeEdit();
                                formSubmit();
                              }}
                              primary
                              size="big"
                            >Save</Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </div>
                  }
                  { !this.state.edit && disclosure.data &&
                    <div>
                      <div className="disclosure-read">
                        <div className="modify">{disclosure.modifyBy ? `${disclosure.modifyBy},` : ''} created {moment(disclosure.modifyDate).format('LL')}</div>
                        <div dangerouslySetInnerHTML={this.decodeHtml()} />
                      </div>
                      <Button className="button-edit" onClick={this.changeEdit} size="mini">Edit</Button>
                    </div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Admin;
