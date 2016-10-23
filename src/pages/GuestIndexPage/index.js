import QRCode from 'qrcode.react';
import React, { Component, PropTypes } from 'react';
import { action, computed, observable } from 'mobx';
import { Card, IconButton, Popover, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { observer } from 'mobx-react';

import Loader from 'app/components/Loader';
import styles from './styles.css';

@observer
class GuestIndexPage extends Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired,
    guestStore: PropTypes.object.isRequired,
  };

  @observable isPopoverOpen = false;
  @observable popoverAnchorEl = null;
  @observable popoverGuest = null;

  @computed
  get guests() {
    return this.props.guestStore.items.peek();
  }

  @action
  handleDownloadClick(ev, guest) {
    this.isPopoverOpen = true;
    this.popoverAnchorEl = ev.currentTarget;
    this.popoverGuest = guest;
  }
  handleDownloadClick = ::this.handleDownloadClick;

  handleEditGuestClick(guest) {
    this.props.appStore.toggleGuestDialog(true, guest);
  }
  handleEditGuestClick = ::this.handleEditGuestClick;

  @action
  handlePopoverClose() {
    this.isPopoverOpen = false;
  }
  handlePopoverClose = ::this.handlePopoverClose;

  render() {
    const { guestStore } = this.props;

    return (
      <div className={styles.main}>
        <Card>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn width="80">#</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn width="150">Affiliation</TableHeaderColumn>
                <TableHeaderColumn width="110">Party Size</TableHeaderColumn>
                <TableHeaderColumn width="110">Table No.</TableHeaderColumn>
                <TableHeaderColumn width="180">Remarks</TableHeaderColumn>
                <TableHeaderColumn width="150" />
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={false} selectable={false} showRowHover>
              {!guestStore.isLoading && this.guests.map((guest, index) =>
                <TableRow key={guest.id}>
                  <TableRowColumn width="80">{index + 1}</TableRowColumn>
                  <TableRowColumn>{guest.name}</TableRowColumn>
                  <TableRowColumn width="150">{guest.affiliation}</TableRowColumn>
                  <TableRowColumn width="110">{guest.partySize}</TableRowColumn>
                  <TableRowColumn width="110">{guest.allocatedTableNum ? `#${guest.allocatedTableNum}` : 'N/A'}</TableRowColumn>
                  <TableRowColumn width="180">{guest.remarks}</TableRowColumn>
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
