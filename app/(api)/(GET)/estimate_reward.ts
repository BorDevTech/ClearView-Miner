export async function EstimateReward(
  mh: number,
  coin?: string,
  network?: string
): Promise<{
  data: { day: number; month: number; algo: string; coin: string };
  error?: string | null;
}> {
  try {
    const requestBody = {
      mh: mh || 100,
      algo: network || "kawpow",
      coin: coin || "RVN",
    };

    const response = await fetch(
      `https://api.unminable.com/v3/calculate/reward`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      data: {
        day: result.per_day,
        month: result.per_month,
        algo: result.algo,
        coin: result.coin,
      },
    };
  } catch (error) {
    // return { data: 0, error: error.message };
    if (error instanceof Error) {
      return {
        data: { day: 0, month: 0, algo: "not allowed", coin: "error" },
        error: error.message,
      };
    } else {
      return {
        data: { day: 0, month: 0, algo: "not allowed", coin: "error" },
        error: "Unknown error occurred",
      };
    }
  }
}
