import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material'; // Import Material-UI components

function App() {
  // Football positions categorized into Offense, Defense, and Special Teams
  const offensePositions = ['QB', 'HB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'];
  const defensePositions = ['LE', 'DT', 'RE', 'LOLB', 'MLB', 'ROLB', 'CB', 'FS', 'SS'];
  const specialTeamsPositions = ['K', 'P']; // Added Punter (P) position

  // Define options for year and development
  const yearOptions = ['RC', 'FR', 'SO', 'JR', 'SR', 'FR(RS)', 'SO(RS)', 'JR(RS)', 'SR(RS)'];
  const developmentOptions = ['Gem', 'Normal', 'Impact', 'Star', 'Elite'];

  // State to manage players per position
  const [playersByPosition, setPlayersByPosition] = useState({
    QB: [], HB: [], WR: [], TE: [], LT: [], LG: [], C: [], RG: [], RT: [],
    LE: [], DT: [], RE: [], LOLB: [], MLB: [], ROLB: [], CB: [], FS: [], SS: [],
    K: [], P: [] // Added Punter (P)
  });

  // State to track the active tab (Player Tracker, Class Summary, Totals, Development Traits, Team View Offense, Team View Defense)
  const [activeTab, setActiveTab] = useState('tracker');

  // Function to add a new player to a position
  const addPlayer = (position) => {
    setPlayersByPosition({
      ...playersByPosition,
      [position]: [
        ...playersByPosition[position],
        { name: '', year: 'FR', development: 'Normal' }, // Default values for a new player
      ],
    });
  };

  // Function to remove a player from a position by index
  const removePlayer = (position, index) => {
    const updatedPlayers = playersByPosition[position].filter((_, i) => i !== index);
    setPlayersByPosition({
      ...playersByPosition,
      [position]: updatedPlayers,
    });
  };

  // Function to handle player changes (name, year, development)
  const handlePlayerChange = (position, index, key, value) => {
    const updatedPlayers = playersByPosition[position].map((player, i) =>
      i === index ? { ...player, [key]: value } : player
    );
    setPlayersByPosition({
      ...playersByPosition,
      [position]: updatedPlayers,
    });
  };

  // Helper function to count players by year category and position
  const countPlayersByYearAndPosition = (positionList) => {
    return positionList.reduce((summary, position) => {
      summary[position] = {
        Recruit: playersByPosition[position].filter(player => player.year === 'RC').length,
        Freshman: playersByPosition[position].filter(player => player.year === 'FR' || player.year === 'FR(RS)').length,
        Sophomore: playersByPosition[position].filter(player => player.year === 'SO' || player.year === 'SO(RS)').length,
        Junior: playersByPosition[position].filter(player => player.year === 'JR' || player.year === 'JR(RS)').length,
        Senior: playersByPosition[position].filter(player => player.year === 'SR' || player.year === 'SR(RS)').length,
        TotalPlayers: playersByPosition[position].length // Total number of players at that position
      };
      return summary;
    }, {});
  };

  // Helper function to count total players in each category
  const countTotalPlayers = (positionList) => {
    return positionList.reduce((total, position) => total + playersByPosition[position].length, 0);
  };

  // Helper function to count players by development trait and position
  const countPlayersByDevelopmentAndPosition = (positionList) => {
    return positionList.reduce((summary, position) => {
      summary[position] = {
        Normal: playersByPosition[position].filter(player => player.development === 'Normal').length,
        Impact: playersByPosition[position].filter(player => player.development === 'Impact').length,
        Star: playersByPosition[position].filter(player => player.development === 'Star').length,
        Elite: playersByPosition[position].filter(player => player.development === 'Elite').length
      };
      return summary;
    }, {});
  };

  // Generate summary data for each category
  const offenseSummary = countPlayersByYearAndPosition(offensePositions);
  const defenseSummary = countPlayersByYearAndPosition(defensePositions);
  const specialTeamsSummary = countPlayersByYearAndPosition(specialTeamsPositions);

  // Generate development trait data for each category
  const offenseDevelopmentSummary = countPlayersByDevelopmentAndPosition(offensePositions);
  const defenseDevelopmentSummary = countPlayersByDevelopmentAndPosition(defensePositions);
  const specialTeamsDevelopmentSummary = countPlayersByDevelopmentAndPosition(specialTeamsPositions);

  // Calculate total players for Offense, Defense, and Special Teams
  const totalOffensePlayers = countTotalPlayers(offensePositions);
  const totalDefensePlayers = countTotalPlayers(defensePositions);
  const totalSpecialTeamsPlayers = countTotalPlayers(specialTeamsPositions);

  // Calculate the team total (sum of Offense, Defense, Special Teams)
  const totalTeamPlayers = totalOffensePlayers + totalDefensePlayers + totalSpecialTeamsPlayers;

  // Layout helpers for offense and defense in rows
  const renderPosition = (position) => (
    <Box border={1} padding={1} margin={1} textAlign="center">
      <Typography variant="h5">{position}</Typography>
      {playersByPosition[position].length > 0 ? (
        playersByPosition[position].map((player, index) => (
          <Typography key={index} variant="body1">
            {player.name} - {player.year} - {player.development}
          </Typography>
        ))
      ) : (
        <Typography variant="body2">No Players</Typography>
      )}
    </Box>
  );

  const renderOffenseView = () => (
    <Grid container spacing={1} justifyContent="center">
      {offensePositions.map((pos) => (
        <Grid item key={pos}>{renderPosition(pos)}</Grid>
      ))}
    </Grid>
  );

  const renderDefenseView = () => (
    <Grid container spacing={1} justifyContent="center">
      {defensePositions.map((pos) => (
        <Grid item key={pos}>{renderPosition(pos)}</Grid>
      ))}
    </Grid>
  );

  return (
    <div className="App">
      <header>
        <Typography variant="h2" align="center">
          CFB Dynasty Team Tracker
        </Typography>
        <Grid container justifyContent="center" spacing={2} style={{ marginTop: '20px' }}>
          <Grid item>
            <Button variant="contained" color={activeTab === 'tracker' ? 'primary' : 'default'} onClick={() => setActiveTab('tracker')}>
              Player Tracker
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color={activeTab === 'summary' ? 'primary' : 'default'} onClick={() => setActiveTab('summary')}>
              Class Year Summary
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color={activeTab === 'totals' ? 'primary' : 'default'} onClick={() => setActiveTab('totals')}>
              Player Totals
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color={activeTab === 'development' ? 'primary' : 'default'} onClick={() => setActiveTab('development')}>
              Development Traits
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color={activeTab === 'offense' ? 'primary' : 'default'} onClick={() => setActiveTab('offense')}>
              Team View Offense
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color={activeTab === 'defense' ? 'primary' : 'default'} onClick={() => setActiveTab('defense')}>
              Team View Defense
            </Button>
          </Grid>
        </Grid>
      </header>

      <main>
      {activeTab === 'tracker' && (
  <div>
    {[...offensePositions, ...defensePositions, ...specialTeamsPositions].map((position) => (
      <div key={position} style={{ marginBottom: '30px' }}> {/* Increased bottom margin for more spacing */}
        <Typography variant="h4" style={{ marginBottom: '15px' }}>{position}</Typography> {/* Added margin to position title */}
        {playersByPosition[position].map((player, index) => (
          <Grid container spacing={4} key={index} alignItems="center" style={{ marginBottom: '20px' }}> {/* Increased Grid spacing and bottom margin */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Player Name"
                variant="outlined"
                value={player.name}
                onChange={(e) => handlePlayerChange(position, index, 'name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Player Year"
                value={player.year}
                onChange={(e) => handlePlayerChange(position, index, 'year', e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                {yearOptions.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Development"
                value={player.development}
                onChange={(e) => handlePlayerChange(position, index, 'development', e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                {developmentOptions.map((devOption) => (
                  <option key={devOption} value={devOption}>
                    {devOption}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" color="secondary" onClick={() => removePlayer(position, index)}>
                Remove Player
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" color="primary" onClick={() => addPlayer(position)} style={{ marginTop: '10px' }}>
          Add Player to {position}
        </Button>
      </div>
    ))}
  </div>
)}
        {/* Class Year Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            <Typography variant="h3">Class Year Summary</Typography>
            {/* Offense Summary */}
            <Typography variant="h4">Offense</Typography>
            {Object.keys(offenseSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Recruits: {offenseSummary[position].Recruit}</p>
                <p>Freshmen: {offenseSummary[position].Freshman}</p>
                <p>Sophomores: {offenseSummary[position].Sophomore}</p>
                <p>Juniors: {offenseSummary[position].Junior}</p>
                <p>Seniors: {offenseSummary[position].Senior}</p>
                <p>Total Players at {position}: {offenseSummary[position].TotalPlayers}</p> {/* Display total players */}
              </div>
            ))}

            {/* Defense Summary */}
            <Typography variant="h4">Defense</Typography>
            {Object.keys(defenseSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Recruits: {defenseSummary[position].Recruit}</p>
                <p>Freshmen: {defenseSummary[position].Freshman}</p>
                <p>Sophomores: {defenseSummary[position].Sophomore}</p>
                <p>Juniors: {defenseSummary[position].Junior}</p>
                <p>Seniors: {defenseSummary[position].Senior}</p>
                <p>Total Players at {position}: {defenseSummary[position].TotalPlayers}</p> {/* Display total players */}
              </div>
            ))}

            {/* Special Teams Summary */}
            <Typography variant="h4">Special Teams</Typography>
            {Object.keys(specialTeamsSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Recruits: {specialTeamsSummary[position].Recruit}</p>
                <p>Freshmen: {specialTeamsSummary[position].Freshman}</p>
                <p>Sophomores: {specialTeamsSummary[position].Sophomore}</p>
                <p>Juniors: {specialTeamsSummary[position].Junior}</p>
                <p>Seniors: {specialTeamsSummary[position].Senior}</p>
                <p>Total Players at {position}: {specialTeamsSummary[position].TotalPlayers}</p> {/* Display total players */}
              </div>
            ))}
          </div>
        )}

        {/* Player Totals Tab */}
        {activeTab === 'totals' && (
          <div>
            <Typography variant="h3">Total Player Count</Typography>
            <p>Offense: {totalOffensePlayers}</p>
            <p>Defense: {totalDefensePlayers}</p>
            <p>Special Teams: {totalSpecialTeamsPlayers}</p>
            <p>Team Total: {totalTeamPlayers}</p> {/* Display total team players */}
          </div>
        )}

        {/* Development Traits Tab */}
        {activeTab === 'development' && (
          <div>
            <Typography variant="h3">Development Trait Totals</Typography>
            {/* Offense Development Summary */}
            <Typography variant="h4">Offense</Typography>
            {Object.keys(offenseDevelopmentSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Normal: {offenseDevelopmentSummary[position].Normal}</p>
                <p>Impact: {offenseDevelopmentSummary[position].Impact}</p>
                <p>Star: {offenseDevelopmentSummary[position].Star}</p>
                <p>Elite: {offenseDevelopmentSummary[position].Elite}</p>
              </div>
            ))}

            {/* Defense Development Summary */}
            <Typography variant="h4">Defense</Typography>
            {Object.keys(defenseDevelopmentSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Normal: {defenseDevelopmentSummary[position].Normal}</p>
                <p>Impact: {defenseDevelopmentSummary[position].Impact}</p>
                <p>Star: {defenseDevelopmentSummary[position].Star}</p>
                <p>Elite: {defenseDevelopmentSummary[position].Elite}</p>
              </div>
            ))}

            {/* Special Teams Development Summary */}
            <Typography variant="h4">Special Teams</Typography>
            {Object.keys(specialTeamsDevelopmentSummary).map((position) => (
              <div key={position}>
                <Typography variant="h6">{position}</Typography>
                <p>Normal: {specialTeamsDevelopmentSummary[position].Normal}</p>
                <p>Impact: {specialTeamsDevelopmentSummary[position].Impact}</p>
                <p>Star: {specialTeamsDevelopmentSummary[position].Star}</p>
                <p>Elite: {specialTeamsDevelopmentSummary[position].Elite}</p>
              </div>
            ))}
          </div>
        )}

        {/* Team View Offense Tab */}
        {activeTab === 'offense' && (
          <div>
            <Typography variant="h3">Offense Depth Chart</Typography>
            {renderOffenseView()}
          </div>
        )}

        {/* Team View Defense Tab */}
        {activeTab === 'defense' && (
          <div>
            <Typography variant="h3">Defense Depth Chart</Typography>
            {renderDefenseView()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
