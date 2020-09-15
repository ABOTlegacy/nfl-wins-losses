import { Request, Response } from 'express';
import { cache } from '../cache';
import { Log } from '../Log';
import { CsvReader } from '../utils/CsvReader';
import determineRankings from '../computations/determineRankings';

type OwnerRow = string[];

interface BumpData {
  [key: string]: {
    [key: string]: number; // key is the week number as string
  };
}

const sendBump = (req: Request, res: Response): void => {
  if (cache.has('bump')) {
    res.send('CACHE:' + cache.get('bump'));
    Log.send('Bump Chart Data');
  } else {
    // bump data is not cached so, generate it, send it, and cache it
    const bumpData: BumpData = {};

    // Get old rankings from CSV file
    // These rankings can't be generated from any of the API information
    const csv = new CsvReader('rankingsByWeek.csv');
    csv.read();
    const csvRankings = csv.data.slice(1); // slice removes header row

    // Includes the current ranking which updates as games end and
    // ESPN APIs are updated
    const currentRankings = determineRankings(req.app.locals.owners);

    csvRankings.forEach((ownerRow: OwnerRow) => {
      // Get Owner name from row 1 of CSV file
      const ownerShortName = ownerRow[0];

      const rankHistory = {};
      ownerRow.slice(1).forEach((rank, index) => {
        rankHistory[index.toString()] = parseInt(rank);
      });

      console.log(currentRankings);

      // Look up the owner's current ranking
      currentRankings.forEach((rank) => {
        if (rank.owner.info.shortName === ownerShortName) {
          rankHistory['current'] = rank.currentRank;
        }
      });

      bumpData[ownerShortName] = rankHistory;
    });

    res.send(bumpData);
    Log.send('Bump Chart Data');

    // cache.set('bump', previousWeeks);
    // Log.cache('Bump Chart Data');
  }
};

export default sendBump;
