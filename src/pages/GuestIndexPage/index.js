import _ from 'lodash';
import QRCode from 'qrcode.react';
import React, { Component, PropTypes } from 'react';
import { action, observable, runInAction } from 'mobx';
import { Card, Dialog, FlatButton, FloatingActionButton, FontIcon, IconButton, Popover, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { observer } from 'mobx-react';

import GuestForm from 'app/forms/GuestForm';
import Loader from 'app/components/Loader';
import styles from './styles.css';
import { Guest } from 'app/stores/GuestStore';

@observer
class GuestIndexPage extends Component {
  static propTypes = {
    guestStore: PropTypes.object.isRequired,
    settingStore: PropTypes.object.isRequired,
    tableStore: PropTypes.object.isRequired,
  };

  @observable guest = new Guest();

  @observable isOpen = false;
  @observable isPopoverOpen = false;
  @observable popoverAnchorEl = null;
  @observable popoverGuest = {};
  @observable submitting = false;

  @action
  handleDownloadClick(ev, guest) {
    this.isPopoverOpen = true;
    this.popoverAnchorEl = ev.currentTarget;
    this.popoverGuest = guest;
  }
  handleDownloadClick = ::this.handleDownloadClick;

  @action
  handleModalToggle(open) {
    this.isOpen = typeof open === 'boolean' ? open : !this.state.isOpen;
  }
  handleModalToggle = ::this.handleModalToggle;

  @action
  handleSetGuest(guest) {
    this.guest = guest || new Guest();
  }
  handleSetGuest = ::this.handleSetGuest;

  @action
  async handleSubmit() {
    this.submitting = true;

    if (this.guest.id) {
      await this.props.guestStore.save();
    } else {
      await this.props.guestStore.add(this.guest.asJSON);
    }

    runInAction(() => {
      this.isOpen = false;
      this.submitting = false;
    });
  }
  handleSubmit = ::this.handleSubmit;

  render() {
    const { guestStore, settingStore, tableStore, ...props } = this.props;

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
              {guestStore.items && _.map(guestStore.items, (guest, index) =>
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
                      onClick={() => {
                        this.handleSetGuest(guest);
                        this.handleModalToggle(true);
                      }}
                      tooltip="Edit"
                    >
                      input
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              )}

              {guestStore.items && guestStore.items.length === 0 &&
                <TableRow>
                  <TableRowColumn>
                    No Results
                  </TableRowColumn>
                </TableRow>
              }

              {!guestStore.items &&
                <TableRow>
                  <TableRowColumn>
                    <Loader />
                  </TableRowColumn>
                </TableRow>
              }
            </TableBody>
          </Table>

          <span className={styles.add}>
            <FloatingActionButton
              mini
              onClick={() => {
                this.handleSetGuest();
                this.handleModalToggle(true);
              }}
            >
              <FontIcon className="material-icons">add</FontIcon>
            </FloatingActionButton>
          </span>
        </Card>

        <Popover
          anchorEl={this.popoverAnchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onRequestClose={() => { this.isPopoverOpen = false; }}
          open={this.isPopoverOpen}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <QRCode value={this.popoverGuest.id} />
        </Popover>

        <Dialog
          actions={[
            <FlatButton
              disabled={this.submitting}
              label="Cancel"
              onTouchTap={() => this.handleModalToggle(false)}
            />,
            <FlatButton
              disabled={this.guest.pristine || this.submitting}
              label={this.guest.id ? 'Save' : 'Add'}
              onTouchTap={this.handleSubmit}
              primary
            />,
          ]}
          bodyStyle={{ maxheight: 550 }}
          open={this.isOpen}
          title={this.guest.id ? 'Edit Guest' : 'Add Guest'}
          contentStyle={{ maxWidth: 823, width: 'auto' }}
        >
          <GuestForm guest={this.guest} settingStore={settingStore} tableStore={tableStore} />
        </Dialog>
      </div>
    );
  }
}

export default GuestIndexPage;
