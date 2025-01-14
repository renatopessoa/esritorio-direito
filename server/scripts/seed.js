import { sequelize, User, Case, Party } from '../models/index.js';
import { users } from '../data/users.js';
import { cases } from '../data/cases.js';
import { parties } from '../data/parties.js';

async function seed() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create users
    const createdUsers = await User.bulkCreate(users);
    console.log('Users seeded');

    // Create cases
    const createdCases = await Case.bulkCreate(cases);
    console.log('Cases seeded');

    // Create parties
    const createdParties = await Party.bulkCreate(parties);
    console.log('Parties seeded');

    // Associate cases with parties and lawyers
    await Promise.all(createdCases.map(async (case_, index) => {
      // Assign lawyers alternately
      const lawyerId = index % 2 === 0 ? createdUsers[1].id : createdUsers[2].id;
      await case_.update({ lawyerId });

      // Associate parties based on case type
      switch (index) {
        case 0: // Contract dispute
          await case_.addParties([createdParties[0], createdParties[1]]);
          break;
        case 1: // Criminal case
          await case_.addParties([createdParties[5]]);
          break;
        case 2: // Divorce case
          await case_.addParties([createdParties[2], createdParties[3]]);
          break;
        case 3: // Employment case
          await case_.addParties([createdParties[6], createdParties[7]]);
          break;
        case 4: // Property dispute
          await case_.addParties([createdParties[0], createdParties[5]]);
          break;
        case 5: // Patent case
          await case_.addParties([createdParties[4], createdParties[1]]);
          break;
        case 6: // Insurance case
          await case_.addParties([createdParties[2], createdParties[7]]);
          break;
      }
    }));
    console.log('Relationships established');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();