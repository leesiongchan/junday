import QrReader from 'react-qr-reader';
import nl2br from 'nl2br';
import React, { Component, PropTypes } from 'react';
import { action, computed, observable } from 'mobx';
import { Card } from 'material-ui';
import { observer } from 'mobx-react';

import FieldPanel from './components/FieldPanel';
import styles from './styles.css';

@observer
class ScanPage extends Component {
  static propTypes = {
    guestStore: PropTypes.object,
  };

  @observable currentData = null;

  @computed
  get result() {
    return this.props.guestStore.find(this.currentData);
  }

  handleError(err) {
    console.log('Error', err);
  }
  handleError = ::this.handleError;

  @action
  handleScan(data) {
    this.currentData = data;
  }
  handleScan = ::this.handleScan;

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.wrapper}>
          <aside className={styles.aside}>
            <div className={styles.scannerWrapper}>
              <QrReader
                handleError={this.handleError}
                handleScan={this.handleScan}
                interval={500}
                previewStyle={{ height: 400, width: 400 }}
              />

              <div className={styles.scanner} />
            </div>
          </aside>

          <div className={styles.content}>
            <Card className={styles.card}>
              {this.result &&
                <div className={styles.result}>
                  <h1 className={styles.name}>{this.result.name}</h1>

                  <FieldPanel className={styles.field} label="ID">
                    <span className={styles.text}>
                      {this.result.id}
                    </span>
                  </FieldPanel>

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
                </div>
              }

              {!this.result &&
                <p className={styles.message}>
                  Scan your QR Code to see your guest information.
                </p>
              }
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default ScanPage;
