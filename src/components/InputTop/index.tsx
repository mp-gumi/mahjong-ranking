import { useCallback, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type GamePlayer = {
  point: string;
};

type Game = {
  players: GamePlayer[];
};

type Player = {
  name: string;
};

type FieldValues = {
  games: Game[];
  players: Player[];
  startPoint: string;
  borderPoint: string;
  thirdToSecond: string;
  fourthToTop: string;
};

type Result = Player & {
  totalPoint: number;
};

type Results = Result[];

function InputTop(): JSX.Element {
  const [results, setResults] = useState<Results>([]);
  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    ({ games, players }) => {
      console.log(games, players);

      setResults(
        players.map(({ name }, index) => ({
          name,
          totalPoint: games
            .map(({ players }) => {
              const { point } = players[index];

              return parseInt(point, 10);
            })
            .reduce((prevValue, currentValue) => prevValue + currentValue, 0),
        }))
      );
    },
    []
  );
  const { control, handleSubmit, register } = useForm<FieldValues>({
    defaultValues: {
      games: [
        {
          players: [
            { point: "0" },
            { point: "0" },
            { point: "0" },
            { point: "0" },
          ],
        },
      ],
      players: [
        { name: "hoge" },
        { name: "fuga" },
        { name: "piyo" },
        { name: "moge" },
      ],
      startPoint: "25000",
      borderPoint: "30000",
      thirdToSecond: "10",
      fourthToTop: "20",
    },
  });
  const {
    append,
    fields: gamesFields,
    remove,
  } = useFieldArray({
    control,
    name: "games",
  });
  const { fields: playersFields } = useFieldArray({
    control,
    name: "players",
  });
  const handleAppend = useCallback(() => {
    append({
      players: [{ point: "0" }, { point: "0" }, { point: "0" }, { point: "0" }],
    });
  }, [append]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        オカ
        <input
          {...register("startPoint", {
            required: true,
          })}
          type="number"
        />
        <input
          {...register("borderPoint", {
            required: true,
          })}
          type="number"
        />
      </div>
      <div>
        ウマ
        <input
          {...register("thirdToSecond", { required: true })}
          type="number"
        />
        <input {...register("fourthToTop", { required: true })} type="number" />
      </div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            {playersFields.map(({ id }, index) => (
              <th key={id}>
                <input
                  {...register(`players.${index}.name`, {
                    required: true,
                  })}
                />
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {gamesFields.map(({ id, players }, gameIndex) => (
            <tr key={id}>
              <td>{gameIndex + 1}</td>
              {players.map((_, playerIndex) => (
                <td key={playerIndex}>
                  <input
                    {...register(
                      `games.${gameIndex}.players.${playerIndex}.point`,
                      {
                        required: true,
                      }
                    )}
                    type="number"
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    remove(gameIndex);
                  }}
                  type="button"
                >
                  ゲームを削除する
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>合計</th>
            {results.map(({ totalPoint }, index) => (
              <td key={index}>{totalPoint}</td>
            ))}
          </tr>
        </tfoot>
      </table>
      <button onClick={handleAppend} type="button">
        ゲームを追加する
      </button>
      <button type="submit">計算する</button>
      <ul>
        {results
          .sort(({ totalPoint: totalPointA }, { totalPoint: totalPointB }) => {
            if (totalPointA < totalPointB) {
              return 1;
            }

            if (totalPointA > totalPointB) {
              return -1;
            }

            return 0;
          })
          .map(({ name, totalPoint }, index) => (
            <li key={name}>{`${index + 1}位 ${name}さん: ${totalPoint}`}</li>
          ))}
      </ul>
    </form>
  );
}

export default InputTop;
