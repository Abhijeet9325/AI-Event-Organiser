import { query } from "@/convex/_generated/server";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
    const result = useQuery(query);
    const [data, setData] = useState(undefined)
    const [isLoading, setisLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (result === undefined) {
            setisLoading(true);
        }
        else {
            try {
                setData(result);
                setError(null);
            }
            catch (err) {
                setError(err);
                toast.error(err.message);
            }
            finally {
                setisLoading(false)
            }
        }
    }, [result])

    return {
        data,
        isLoading,
        error
    }

}
export const useConvexMutation = (mutation) => {
    const mutationFunc = useMutation(mutation);

    const [data, setData] = useState(undefined)
    const [isLoading, setisLoading] = useState(true)
    const [error, setError] = useState(null)

    const mutate = async (...args) => {
        setisLoading(true);
        setError(null);

        try {
            const response = await mutationFunc(...args);
            setData(response);
            return response;
        }
        catch (err) {
            setError(err);
            toast.error(err.message);
            throw err;
        }
        finally {
            setisLoading(false);
        }
    }
    return {
       mutate,
        data,
        isLoading,
        error
    }
}