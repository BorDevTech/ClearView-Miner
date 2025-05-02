"use client";

import { useState, useEffect } from "react";
import { EstimateReward } from "./(api)/(GET)/estimate_reward";
import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { register } from "module";

interface RewardFormValues {
  mh: number;
  algo: string;
  coin: string;
}
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RewardFormValues>();

  const [rewardData, setRewardData] = useState<{
    result?: {
      day: number;
      month: number;
      algo?: string | null;
      coin: string | null;
    };
    error?: string | null;
  } | null>(null);
  const onSubmit = async (data: RewardFormValues) => {
    // Call the API with the form data
    const result = await EstimateReward(data.mh, data.coin, data.algo);
    setRewardData({
      result: {
        day: result.data.day,
        month: result.data.month,
        coin: result.data.coin,
      },
      error: result.error || null,
    });
  };

  // useEffect(() => {
  //   async function fetchReward() {
  //     const result = await EstimateReward(120, "RVN", "kawpow");
  //     setRewardData({
  //       result: {
  //         day: result.data.day,
  //         month: result.data.month,
  //         coin: result.data.coin,
  //       },
  //       error: null,
  //     });
  //   }

  //   fetchReward();
  // }, []);

  console.log("Reward Data:", rewardData);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* New div to display the reward data */}
        <div className="mt-8 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" align="flex-start" maxW="sm">
              <Field.Root invalid={!!errors.mh}>
                <Field.Label>Hashrate</Field.Label>
                <Input
                  {...register(
                    "mh"
                    // { required: "Hashrate amount is required" }
                  )}
                  defaultValue={"120"}
                />
                <Field.ErrorText>{errors.mh?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.coin}>
                <Field.Label>Coin name</Field.Label>
                <Input
                  {...register(
                    "coin"
                    // { required: "Coin name is required" }
                  )}
                  defaultValue={rewardData?.result?.coin || "RVN"}
                />
                <Field.ErrorText>{errors.coin?.message}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors.coin}>
                <Field.Label>Algo name</Field.Label>
                <Input
                  {...register(
                    "algo"
                    // { required: "Algo name is required" }
                  )}
                  defaultValue={rewardData?.result?.algo || "kawpow"}
                />
                <Field.ErrorText>{errors.algo?.message}</Field.ErrorText>
              </Field.Root>

              <Button type="submit">Submit</Button>
            </Stack>
          </form>
          {rewardData ? (
            rewardData.error ? (
              <p className="text-red-500">Error: {rewardData.error}</p>
            ) : (
              <>
                <p className="text-green-500">
                  Daily Reward:
                  {` ${rewardData.result?.day} ${rewardData.result?.coin}`}
                </p>
                <p className="text-green-500">
                  Monthly Reward:
                  {` ${rewardData.result?.month} ${rewardData.result?.coin}`}
                </p>
              </>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
