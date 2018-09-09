import pick from 'lodash/pick';
import React from 'react';
import get from 'lodash/get';
import {
  compose,
  withStateHandlers
} from 'recompose';

// CONTROLLERS
import JsonViewer from '../controllers/JsonViewer';
import {
  Caller,
  Activator
} from '../../src';

// COMPONENTS
import ReactJson from 'react-json-view';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Modal from '../components/Modal';
import FixedPaper from '../components/FixedPaper';

import {
  deleteComment,
  getComments
} from '../api';
import { comments as initialComments } from '../data';

const CallerWithActivator = compose(
  withStateHandlers({ comments: initialComments }, { onChangeComments: () => (comments) => ({ comments }) })
)(
  ({
    comments,
    onChangeComments
  }) => {
    return (
      <JsonViewer>
        {({ displayJson }) => {
          const wrapDisplayJson = (object) => {
            const json = pick(object, ['status', 'response', 'error']);
            displayJson({ comments, ...json });
          };
          // 1. can decorate here
          // const decoratedDeleteComment = (id) => deleteComment(comments, id)
          //   .then((result) => {
          //     onChangeComments(result);
          //     return result;
          //   });
          return (
            <Caller
              // 1.1 pass decorated api here
              // api={decoratedDeleteComment}
              api={deleteComment}
              onDidMount={wrapDisplayJson}
              onRequest={wrapDisplayJson}
              onSuccess={wrapDisplayJson}
              onFailure={wrapDisplayJson}
            >
              {({ wrappedApi, status, response, error, reset: resetCaller }) => {
                const decoratedResetCaller = () => resetCaller(wrapDisplayJson);
                return (
                  <Activator resetAfterAction={{ isRequest: true }}>
                    {({
                      active,
                      activate,
                      decorate,
                      params,
                      reset: resetActivator
                    }) => {
                      const commentId = get(params, '[0]');
                      // 2. can decorate here
                      const decoratedApi = decorate(() => (
                        wrappedApi(comments, commentId)
                          .then(onChangeComments)
                      ));
                      return (
                        <Paper>
                          {active && (
                            <FixedPaper>
                              <p><strong>Params</strong></p>
                              <ReactJson src={params} />
                            </FixedPaper>
                          )}
                          <List>
                            {comments.map(({ id, user, text, createdAt }) => (
                              <ListItem divider key={id}>
                                <ListItemText primary={text} secondary={createdAt} />
                                <ListItemSecondaryAction>
                                  <Button
                                    variant={'outlined'}
                                    color={'secondary'}
                                    onClick={() => activate(id)}
                                  >
                                    Remove
                                  </Button>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                          <Modal
                            open={active}
                            title={`Do you want to delete ${commentId}`}
                            onSubmit={decoratedApi}
                            onClose={resetActivator}
                          />
                          <Modal
                            open={status.isSuccess}
                            title={'Success'}
                            content={`${commentId} is deleted`}
                            onSubmit={decoratedResetCaller}
                          />
                          <Modal
                            open={status.isRequest}
                            title={'Processing'}
                            content={`deleting comment id: ${commentId}`}
                          />
                        </Paper>
                      );
                    }}
                  </Activator>
                );
              }}
            </Caller>
          );
        }}
      </JsonViewer>
    );
  }
);

export default CallerWithActivator;
