import _ from 'lodash';
import cx from 'classnames';
import QRCode from 'qrcode.react';
import React, { Component, PropTypes } from 'react';
import shallowEqual from 'shallowequal';
import { action, computed, observable } from 'mobx';
import { browserHistory } from 'react-router';
import { Card, IconButton, Popover, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { observer } from 'mobx-react';

import Loader from 'app/components/Loader';
import styles from './styles.css';

@observer
class GuestIndexPage extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    guestStore: PropTypes.object,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }).isRequired,
  };

  @action
  componentDidMount() {
    this.query = this.props.location.query;
  }

  @action
  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.location.query, this.props.location.query)) {
      this.query = nextProps.location.query;
    }
  }

  @observable query = {
    sort: null,
  };
  @observable isPopoverOpen = false;
  @observable popoverAnchorEl = null;
  @observable popoverGuest = null;

  @computed
  get guests() {
    const guests = this.props.guestStore.items.peek();

    switch (this.query.sort) {
      case 'affiliation:asc':
        return _.sortBy(guests, 'affiliation');

      case 'affiliation:desc':
        return _(guests)
          .sortBy('affiliation')
          .reverse()
          .value();

      case 'name:asc':
        return _.sortBy(guests, 'name');

      case 'name:desc':
        return _(guests)
          .sortBy('name')
          .reverse()
          .value();

      case 'tableNum:asc':
        return _.sortBy(guests, 'tableNum');

      case 'tableNum:desc':
        return _(guests)
          .sortBy('tableNum')
          .reverse()
          .value();

      default:
        return guests;
    }
  }

  @action
  handleDownloadClick(ev, guest) {
    this.isPopoverOpen = true;
    this.popoverAnchorEl = ev.currentTarget;
    this.popoverGuest = guest;
  }
  handleDownloadClick = ::this.handleDownloadClick;

  handleEditGuestClick(guest) {
    this.props.appStore.toggleGuestFormDialog(true, guest);
  }
  handleEditGuestClick = ::this.handleEditGuestClick;

  @action
  handlePopoverClose() {
    this.isPopoverOpen = false;
  }
  handlePopoverClose = ::this.handlePopoverClose;

  @action
  handleSortClick(value) {
    browserHistory.push({
      pathname: this.props.location.pathname,
      query: {
        ...this.query,
        sort: value,
      },
    });
  }

  renderSortArrow(bool) {
    return bool ? <span>&#9660;</span> : <span>&#9650;</span>;
  }

  render() {
    const { guestStore } = this.props;

    return (
      <div className={styles.main}>
        <Card>
          <Table
            bodyStyle={{ overflow: 'visible' }}
            wrapperStyle={{ overflow: 'visible' }}
            style={{ overflow: 'visible' }}
          >
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn width="80">#</TableHeaderColumn>
                <TableHeaderColumn>
                  <div className={styles.wrapper}>
                    <span onClick={() => this.handleSortClick(this.query.sort === 'name:asc' ? 'name:desc' : 'name:asc')}>
                      Name
                      <span className={styles.sort}>{this.renderSortArrow(this.query.sort === 'name:asc')}</span>
                    </span>

                    <div className={styles.additionalPanel}>
                      <span onClick={() => this.handleSortClick(this.query.sort === 'affiliation:asc' ? 'affiliation:desc' : 'affiliation:asc')}>
                        (Affiliation
                        <span className={styles.sort}>{this.renderSortArrow(this.query.sort === 'affiliation:asc')}</span>
                        )
                      </span>
                    </div>
                  </div>
                </TableHeaderColumn>
                <TableHeaderColumn width="70">Pax</TableHeaderColumn>
                <TableHeaderColumn width="120">
                  <span onClick={() => this.handleSortClick(this.query.sort === 'tableNum:asc' ? 'tableNum:desc' : 'tableNum:asc')}>
                    Table No.
                    <span className={styles.sort}>{this.renderSortArrow(this.query.sort === 'tableNum:asc')}</span>
                  </span>
                </TableHeaderColumn>
                <TableHeaderColumn width="180">Remarks</TableHeaderColumn>
                <TableHeaderColumn width="120">Status</TableHeaderColumn>
                <TableHeaderColumn width="150" />
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={false} selectable={false} showRowHover>
              {!guestStore.isLoading && this.guests.map((guest, index) =>
                <TableRow key={guest.id}>
                  <TableRowColumn width="80">{index + 1}</TableRowColumn>
                  <TableRowColumn>
                    {guest.name}
                    {' '}
                    {guest.affiliation &&
                      <span className={styles.affiliation}>({guest.affiliation})</span>
                    }
                  </TableRowColumn>
                  <TableRowColumn width="70">{guest.partySize}</TableRowColumn>
                  <TableRowColumn width="120">{guest.allocatedTableNum ? `#${guest.allocatedTableNum}` : 'N/A'}</TableRowColumn>
                  <TableRowColumn width="180">{guest.remarks}</TableRowColumn>
                  <TableRowColumn width="120">
                    <span
                      className={cx(styles.status, {
                        [styles.checkedIn]: guest.status === 'registered',
                      })}
                    >
                      {guest.status !== 'registered' ? 'Not Registered' : 'Registered'}
                    </span>
                  </TableRowColumn>
                  <TableRowColumn style={{ overflow: 'visible' }} width="150">
                    <IconButton
                      iconClassName="material-icons"
                      onClick={ev => this.handleDownloadClick(ev, guest)}
                      tooltip="Download QR Code"
                    >
                      file_download
                    </IconButton>

                    <IconButton
                      iconClassName="material-icons"
                      onClick={() => this.handleEditGuestClick(guest)}
                      tooltip="Edit"
                    >
                      input
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              )}

              {!guestStore.isLoading && this.guests.length === 0 &&
                <TableRow>
                  <TableRowColumn>
                    No Results
                  </TableRowColumn>
                </TableRow>
              }

              {guestStore.isLoading &&
                <TableRow>
                  <TableRowColumn>
                    <Loader />
                  </TableRowColumn>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Card>

        <Popover
          anchorEl={this.popoverAnchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onRequestClose={this.handlePopoverClose}
          open={this.isPopoverOpen}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {this.popoverGuest &&
            <QRCode value={this.popoverGuest.id} />
          }
        </Popover>
      </div>
    );
  }
}

export default GuestIndexPage;
