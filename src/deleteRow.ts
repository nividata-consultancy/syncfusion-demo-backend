import { sampleData, writeToJsonFile } from "./getData";

const deleteRow = (selectedRow, socket) => {
    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    const { parentUniqueID, uniqueId } = selectedRow;
    const { data } = sampleData;

    if (parentUniqueID) {
        for (let i = 0; i < data.length; i++) {
            const subRowIndex = data[i].subRows.map((item) => item.uniqueId).indexOf(uniqueId);
            if (subRowIndex > -1) {
                data[i].subRows.splice(subRowIndex, 1);
                break;
            }
        }
    } else {
        let index = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].uniqueId === uniqueId) {
                index = i;
                break;
            }
        }
        sampleData.data.splice(index, 1);
    }    
    updatedSampleData.data = [...sampleData.data];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForRowUpdate: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { deleteRow };

