import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
        Button, Label, Col, Row, Modal, ModalHeader, ModalBody } from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';

const required = (val) => val && val.length;
const minLength = (len) => (val) => (val) && (val.length >= len);
const maxLength = (len) => (val) => !(val) || (val.length <= len);

function RenderDish({dish}) {
  if (dish != null) {
    return(
      <div className="col-12 col-md-5 m-1">
        <Card>
          <CardImg width="100%" src={dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    return(
      <div></div>
    );
  }
}

function RenderComments({commentsList, addComment, dishId}) { 
  if (commentsList != null) {   
    const comments = commentsList.map((comment) => 
      <li key={comment.id}>
        <div>
          {comment.comment}
        </div>
        <div>
          -- {comment.author} , {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
        </div>
      </li>
    );

    return(
      <div className="col-12 col-md-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">{comments}</ul>
        <CommentForm dishId={dishId} addComment={addComment} />
      </div>
    )
  } else {
    return(
      <div></div>
    )
  }
}

const DishDetail = (props) => {
  if (props.isLoading) {
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return(
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/home'>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to='/menu'>Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              {props.dish.name}
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderDish dish={props.dish} />
          <RenderComments commentsList={props.comments}
            addComment={props.addComment}
            dishId={props.dish.id} />
        </div>
      </div>
    );
  } else {
    return(
      <div></div>
    );
  }
}

class CommentForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  render() {
    return(
      <>
        <Button outline onClick={this.toggleModal}>
          <span className="fa fa-pencil fa-lg"></span> Submit Comment
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>        
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>              
              <Row className="form-group mb-2">
                <Label htmlFor="rating">Rating</Label>
                <Col>
                  <Control.select model=".rating" id="rating" name="rating"
                  className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group mb-2">
                <Label htmlFor="author">Your Name</Label>
                <Col>
                  <Control.text model=".author"id="author" name="author"
                    placeholder="Your Name"
                    className="form-control" 
                    validators={{
                      required, minLength: minLength(3), maxLength: maxLength(15)
                    }} />
                  <Errors 
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      required: 'Required. ',
                      minLength: 'Must be greater than 2 characters. ',
                      maxLength: 'Must be 15 characters or less. '
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group mb-2">
                <Label htmlFor="comment">Comment</Label>
                <Col>
                  <Control.textarea model=".comment" id="comment" name="comment"
                    rows="6" className="form-control" />
                </Col>
              </Row>
              <Row className="form-group mb-2">
                <Col>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default DishDetail;