import React, { Component, PropTypes } from 'react';
import { Card, FloatingActionButton, FontIcon, IconButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Loader from 'app/components/Loader';
import NotFoundPage from 'app/pages/NotFoundPage';
import styles from './styles.css';
import { ROLE, ROLE_RANK } from 'app/constants/user';

function getRole(role) {
  switch (role) {
    case ROLE.ADMIN:
      return 'Admin';

    case ROLE.USER:
      return 'User';

    default:
      return null;
  }
}

function getRoleRank(role) {
  switch (role) {
    case ROLE.USER:
      return ROLE_RANK.USER;

    case ROLE.ADMIN:
      return ROLE_RANK.ADMIN;

    default:
      return 0;
  }
}

@observer
class UserIndexPage extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    authStore: PropTypes.object,
    notificationStore: PropTypes.object,
    userStore: PropTypes.object,
  };

  @computed
  get user() {
    if (!this.props.authStore.user) {
      return null;
    }

    return this.props.userStore.findBy(u => u.email === this.props.authStore.user.email);
  }

  @computed
  get users() {
    return this.props.userStore.items.peek();
  }

  async handleSendPasswordResetEmailClick(user) {
    try {
      await this.props.authStore.sendPasswordResetEmail(user.email);

      this.props.notificationStore.save({
        message: `${this.props.authStore.user.email} has sent a password reset email to user (${user.email})`,
        open: true,
      });
    } catch (err) {
      console.log('Error', err);
    }
  }
  handleSendPasswordResetEmailClick = ::this.handleSendPasswordResetEmailClick;

  render() {
    const { appStore, userStore } = this.props;

    if (!this.user) {
      return null;
    }

    if (getRoleRank(ROLE.ADMIN) > getRoleRank(this.user.role)) {
      return <NotFoundPage />;
    }

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
                <TableHeaderColumn>Email</TableHeaderColumn>
                <TableHeaderColumn>Role</TableHeaderColumn>
                <TableHeaderColumn width="95" />
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={false} selectable={false} showRowHover>
              {!userStore.isLoading && this.users.map((user, index) =>
                <TableRow key={user.id}>
                  <TableRowColumn width="80">{index + 1}</TableRowColumn>
                  <TableRowColumn>{user.email}</TableRowColumn>
                  <TableRowColumn>{getRole(user.role)}</TableRowColumn>
                  <TableRowColumn style={{ overflow: 'visible' }} width="95">
                    <IconButton
                      iconClassName="material-icons"
                      onClick={() => this.handleSendPasswordResetEmailClick(user)}
                      tooltip="Send Password Reset Email"
                    >
                      send
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              )}

              {!userStore.isLoading && this.users.length === 0 &&
                <TableRow>
                  <TableRowColumn>
                    No Results
                  </TableRowColumn>
                </TableRow>
              }

              {userStore.isLoading &&
                <TableRow>
                  <TableRowColumn>
                    <Loader />
                  </TableRowColumn>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Card>

        <FloatingActionButton
          mini
          onClick={() => appStore.toggleSignUpFormDialog(true)}
          className={styles.add}
        >
          <FontIcon className="material-icons">
            add
          </FontIcon>
        </FloatingActionButton>
      </div>
    );
  }
}

export default UserIndexPage;
