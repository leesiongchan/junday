import _ from 'lodash';
import cx from 'classnames';
import nl2br from 'nl2br';
import QrReader from 'react-qr-reader';
import React, { Component, PropTypes } from 'react';
import { action, computed, observable } from 'mobx';
import { RaisedButton, Card } from 'material-ui';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import FieldPanel from './components/FieldPanel';
import GuestPicker from 'app/controls/GuestPicker';
import styles from './styles.css';

// @TODO do not hardcode please!
const BACKGROUND_PHOTOS = [
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13403297_10155005216184768_8711558632713375606_o.jpg?alt=media&token=9ee57644-5ee3-47de-bcda-8b84b0e88221',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13416738_10155005145904768_931751250445213136_o.jpg?alt=media&token=ae1b417c-d24d-4168-a19e-39d75c3a764d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13422359_10155005216064768_899742461254954015_o.jpg?alt=media&token=d16505fe-debd-4631-b694-303a62c3026d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13458705_10155005130229768_1995584470615303454_o.jpg?alt=media&token=954e66a9-c656-4577-9aa4-10c294b88fbe',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13442599_10155005216529768_2266593902334588957_o.jpg?alt=media&token=5892bdc9-a643-4bcb-a66c-e7ab08c9e1b9',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F14876165_10208972015631437_952823969_o.jpg?alt=media&token=5d39b853-ede1-48f9-9cc2-92b0a9a68315',
];

@observer
class CheckInPage extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    authStore: PropTypes.object,
    guestStore: PropTypes.object,
    notificationStore: PropTypes.object,
  };

  state = {
    backgroundImage: _.sample(BACKGROUND_PHOTOS),
  };

  @observable currentId = null;

  @computed
  get guests() {
    return this.props.guestStore.items;
  }

  @computed
  get progress() {
    return (this.registeredGuests.length / this.guests.length) * 100;
  }

  @computed
  get registeredGuests() {
    return this.guests.filter(guest => guest.status === 'registered');
  }

  @computed
  get result() {
    return this.props.guestStore.find(this.currentId);
  }

  @action
  handleCancel() {
    this.currentId = null;
  }
  handleCancel = ::this.handleCancel;

  @action
  handleChange({ value }) {
    this.currentId = value;
  }
  handleChange = ::this.handleChange;

  @action
  async handleCheckInClick() {
    await this.props.guestStore.save(this.currentId, {
      status: 'registered',
    });
    this.props.notificationStore.save({
      message: `${this.props.authStore.user.email} has registered a guest (${this.result.name}).`,
      open: true,
    });
    this.currentId = null;
  }
  handleCheckInClick = ::this.handleCheckInClick;

  handleError(err) {
    console.log('Error', err);
  }
  handleError = ::this.handleError;

  @action
  handleScan(id) {
    this.currentId = id;
  }
  handleScan = ::this.handleScan;

  handleUpdateDetailsClick() {
    this.props.appStore.toggleGuestFormDialog(true, this.result);
  }
  handleUpdateDetailsClick = ::this.handleUpdateDetailsClick;

  render() {
    const { appStore, guestStore } = this.props;
    const { backgroundImage } = this.state;

    return (
      <div className={styles.main} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <aside className={styles.aside}>
              <Card className={styles.card}>
                <header className={styles.header}>
                  <h1 className={styles.subtitle}>Register guest</h1>

                  <span className={styles.progress}>
                    {this.registeredGuests.length} / {this.guests.length} ({this.progress.toFixed(2)}%)
                  </span>
                </header>

                <div className={styles.searchWrapper}>
                  <GuestPicker
                    appStore={appStore}
                    guestStore={guestStore}
                    onChange={this.handleChange}
                    placeholder="Find guest..."
                    value={this.currentId}
                  />
                </div>

                <span className={styles.or}>Or, scan with QR Code</span>

                <div className={styles.scannerWrapper}>
                  <QrReader
                    handleError={this.handleError}
                    handleScan={this.handleScan}
                    interval={500}
                    previewStyle={{ height: 300, width: 300 }}
                  />

                  <div className={styles.scanner} />
                </div>
              </Card>
            </aside>

            <div className={styles.content}>
              {this.result &&
                <Card className={styles.card} containerStyle={{ height: '100%' }}>
                  <div className={styles.resultWrapper}>
                    <div className={styles.result}>
                      <header className={styles.header}>
                        <h4 className={styles.name}>{this.result.name}</h4>

                        <span className={styles.cancel} onClick={this.handleCancel}>
                          Cancel
                        </span>
                      </header>

                      <FieldPanel className={styles.field} label="Affiliation">
                        <span className={styles.text}>
                          {this.result.affiliation ? this.result.affiliation : '-'}
                        </span>
                      </FieldPanel>

                      <FieldPanel className={styles.field} label="Party Size">
                        <span className={styles.text}>
                          {this.result.partySize ? this.result.partySize : '-'}
                        </span>
                      </FieldPanel>

                      <FieldPanel className={styles.field} label="Table No.">
                        <span className={styles.text}>
                          {this.result.allocatedTableNum ? `#${this.result.allocatedTableNum}` : '-'}
                        </span>
                      </FieldPanel>

                      <FieldPanel className={styles.field} label="Remarks">
                        {this.result.remarks &&
                          <p
                            className={styles.text}
                            dangerouslySetInnerHTML={{ __html: nl2br(this.result.remarks) }}
                          />
                        }

                        {!this.result.remarks && '-'}
                      </FieldPanel>

                      <FieldPanel className={styles.field} label="Status">
                        <span
                          className={cx(styles.text, styles.status, {
                            [styles.checkedIn]: this.result.status === 'registered',
                          })}
                        >
                          {this.result.status !== 'registered' ? 'Not Registered' : 'Registered'}
                        </span>
                      </FieldPanel>
                    </div>


                    <footer className={styles.resultFooter}>
                      <RaisedButton
                        className={styles.button}
                        label="Update Details"
                        onClick={this.handleUpdateDetailsClick}
                      />

                      <RaisedButton
                        className={styles.button}
                        disabled={this.result.status === 'registered'}
                        label="Check In"
                        onClick={this.handleCheckInClick}
                        primary
                      />
                    </footer>
                  </div>
                </Card>
              }
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <Link className={styles.action} to="/settings">Settings</Link>
        </footer>
      </div>
    );
  }
}

export default CheckInPage;
