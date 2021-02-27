import React from "react";
import { useEffect, useState } from 'react'
import "./App.scss";
import Profile from "../User";
import Quest from "../Quest";
import UserQuestLog from "../UserQuestLog";
import HomePage from "../HomePage";
import QuestsList from "../QuestsList";
import userRoutes from "../../routes/user";
import { Route, Switch, useParams } from "react-router-dom";
import { apiCalls } from "../../apiCalls";
import { useEffect, useState } from "react";
import testData from '../test_assets/mock_data'
import { QuestInProgress } from '../../interfaces'
import { apiCalls } from '../../apiCalls'

const quests = testData.quests

//Make a promise for encounter
//const getEncounterDetails = (action) => {
//  Promise.all(apiCalls.etQuestEncounter(questId, userProgress)).then(
//  (data) => {
//    if (data[0]) {
//      action(data[0]);
//    }
//  }
//);
//}
const App = () => {
  const [user, setUser] = useState<any | null>(null);
  const [completedQuests, setCompletedQuests] = useState<any | null>(null);
  const [availableQuests, setAvailableQuests] = useState<QuestInProgress[]>([])

  const getUserInfo = () => {
    Promise.resolve(apiCalls.getUser({ email: "olga@example.com" }))
      .then((response) => setUser(response.data.attributes))
      .then((response) => getCompletedQuests());
  };

  const getCompletedQuests = () => {
    Promise.resolve(apiCalls.getQuests("1", true)).then((response) =>
      setCompletedQuests(questCleaner(response.data.attributes.quests))
    );
  };

  const getQuestDetails = () => {
    Promise.resolve(apiCalls.getQuests("1", false))
    .then((response) => setAvailableQuests(response.data.attributes.quests))
  }

  const questCleaner = (badQuests: Array<object>) => {
    return badQuests.map((badQuest) => Object.values(badQuest)[0]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getUserInfo(), []);
  useEffect(() => getQuestDetails(), []);

  if (user) {
    return (
      <main className="App">
        <HomePage>
          <Route
            exact
            path={userRoutes.profile.path}
            render={() => <Profile user={user} />}
          />
          {completedQuests && (
            <Route
              exact
              path={userRoutes.userQuestLog.path}
              component={() => (
                <UserQuestLog completedQuests={completedQuests} />
              )}
            />
          )}
          <Route exact path={userRoutes.currentQuest.path} render={({match}) => <Quest quests={quests} match={match}/>}/>
          {availableQuests &&
            <Route exact path={userRoutes.availableQuests.path} render={({match}) => <QuestsList quests={quests} match={match}/>} />
          }
        </HomePage>
      </main>
    );
  } else {
    return <h1>Loading</h1>;
  }
};

export default App;
