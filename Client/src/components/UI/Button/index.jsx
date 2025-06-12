import { Button } from "@mui/material";

function ButtonCostume({ children, sx, ...props }) {
    return (
        <Button
            sx={{
                color: "#252525",
                textTransform: "none",
                fontSize: "16px",
                borderRadius: "20px",
                paddingX: 2,
                ":hover": { backgroundColor: "#fbfaf8" },
                ...sx,
            }}
            {...props}
            >
            {children}
        </Button>
    );
}

export default ButtonCostume;
