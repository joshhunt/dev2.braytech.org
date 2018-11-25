import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Items from '../../Items';
import Tooltip from '../../Tooltip/Tooltip';

import '../Progression/PresentationNode.css';
import './Vendors.css';

class Vendors extends Component {
  constructor() {
    super();
    this.state = {
      vendors: []
    };
  }

  componentDidMount() {
    const vendors = ['396892126', '3982706173', '1062861569', '1576276905', '3347378076', '672118013', '1265988377', '69482069', '3603221665', '2398407866', '1735426333', '863940356', '248695599', '3361454721', '895295461', '2190858386'];

    let fetches = vendors.map(vendor => {
      return fetch(`https://api.braytech.org/cache/json/vendors/${vendor}.json`)
        .then(response => {
          return response.json();
        })
        .then(fetch => {
          return fetch;
        });
    });

    Promise.all(fetches)
      .then(promises => {
        this.setState({
          vendors: promises
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let manifest = this.props.manifest;

    if (this.state.vendors.length === 0) {
      return (
        <div className="view" id="loading">
          <h4>Loading vendors</h4>
        </div>
      );
    } else {
      let vendorsList = [];
      let render;
      let vendorResponses = this.state.vendors.filter(response => response.ErrorCode === 1);

      vendorResponses.forEach(response => {
        let vendor = response.Response;

        let definition = manifest.DestinyVendorDefinition[vendor.vendor.data.vendorHash];

        let isActive = (match, location) => {
          if (this.props.match.params.hash === undefined && vendorResponses.indexOf(response) === 0) {
            return true;
          } else if (match) {
            return true;
          } else {
            return false;
          }
        };

        vendorsList.push({
          name: definition.displayProperties.name,
          element: (
            <li key={vendor.vendor.data.vendorHash}>
              <NavLink isActive={isActive} to={`/vendors/${vendor.vendor.data.vendorHash}`}>
                {definition.displayProperties.name}
              </NavLink>
            </li>
          )
        });
      });

      let vendor = this.props.match.params.hash === undefined ? vendorResponses[0] : vendorResponses.filter(response => response.Response.vendor.data.vendorHash === parseInt(this.props.match.params.hash, 10))[0].Response;

      let definition = manifest.DestinyVendorDefinition[vendor.vendor.data.vendorHash];

      let skips = {
        1735426333: [3],
        3982706173: [4],
        672118013: [1],
        1265988377: [1],
        2398407866: [5],
        69482069: [4],
        396892126: [3],
        1576276905: [2],
        3603221665: [6],
        1062861569: [2],
        3361454721: [3, 21, 2]
      };

      let categories = [];
      vendor.categories.data.categories.forEach(category => {
        if (skips[definition.hash] && skips[definition.hash].includes(category.displayCategoryIndex)) {
          return;
        }

        let categoryDefinition = definition.displayCategories[category.displayCategoryIndex];

        let sales = Object.keys(vendor.sales.data)
          .filter(key => category.itemIndexes.includes(parseInt(key, 10)))
          .map(index => vendor.sales.data[index].itemHash);

        categories.push(
          <div key={definition.hash + '-' + category.displayCategoryIndex} className="category">
            <div className="category-header">
              <div>{categoryDefinition.displayProperties.name} {category.displayCategoryIndex}</div>
            </div>
            <ul className="list items">
              <Items manifest={manifest} hashes={sales} />
            </ul>
          </div>
        );
      });

      render = (
        <>
          <div className="sub-header">
            <div>{definition.displayProperties.name}</div>
          </div>
          {categories}
        </>
      );

      vendorsList = orderBy(vendorsList, [item => item.name], ['asc']);

      return (
        <>
          <div className="view" id="vendors">
            <div className="presentation-node vendors">
              <div className="sub-header">
                <div>Vendors <span style={{color:"lime"}}>[BETA]</span></div>
              </div>
              <ul className="list secondary">{vendorsList.map(obj => obj.element)}</ul>
            </div>
            <div className="display">{render}</div>
          </div>
          <Tooltip manifest={this.props.manifest} route={this.props} />
        </>
      );
    }
  }
}

export default Vendors;
