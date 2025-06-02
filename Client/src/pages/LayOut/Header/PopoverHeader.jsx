import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";

import { DropDown } from "../../../components/UI";

function PopoverHeader({ dataRender, right = false }) {
    const navigate = useNavigate();
    
    return (
        <div className="">
            <DropDown name={dataRender.name} right={right}>
                <div className="mb-2 flex flex-row justify-start items-center gap-2">
                    <dataRender.logo />
                    <h2 className="text-[#252525] text-xl">{dataRender.title}</h2>
                </div>
                <List
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        columnGap: 2
                    }}
                    disablePadding>
                    {dataRender.items.map((item) => (
                        <ListItem
                            key={item.title}
                            sx={{
                                paddingY: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                width: "300px",
                                cursor: "pointer",
                                borderRadius: "10px",
                                ":hover": { backgroundColor: "#fbfaf8" }
                            }} onClick={() => navigate(item.path)}>
                            <span className="text-[#252525] text-[16px]">{item.title}</span>
                            <span className="text-[#6f6f6f] text-[0.875rem]">{item.subTitle}</span>
                        </ListItem>
                    ))}
                </List>
            </DropDown>
        </div>
    );
}

PopoverHeader.propTypes = {
    dataRender: PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.array)
    }).isRequired,
    right: PropTypes.bool
};

export default PopoverHeader;
