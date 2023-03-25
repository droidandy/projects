import React, { Component } from "react"
import { connect } from "react-redux"
import {
  updateApplicationRequest,
  fetchApplicationRequest
} from "../../../../actions/application"
import ProductStructure from "../../../../components/ProductStructure";
import axios from "axios";
import {track} from "../../../../libs/helpers";

class Products extends Component {

  componentDidMount() {
    document.title = "Apphud | App products"
  }

  render() {
    return (
      <div className="container-content__blue-content">
        <div className="container-title">
          <span className="va-middle text-black">Products</span>
        </div>
        <div className="container-content__notification">
          <span>Configure permission groups and products structure. Then you can easily run A/B-tests.</span>
          {" "}
          <a
            onClick={() => track("product_learn_more_link_clicked")}
            className="container-content__learn-more-btn no"
            href="https://docs.apphud.com/getting-started/product-hub/products"
            target="_blank"
          >
            &nbsp; Learn more
          </a>
        </div>
        <ProductStructure appId={this.props.match.params.appId} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {
  updateApplicationRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)
