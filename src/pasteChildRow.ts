import { sampleData, writeToJsonFile } from "./getData";
import { v4 as uuidv4 } from 'uuid';

const pasteRows = (selectedRow, copiedRows, isForChild, hasCutOpPerf, socket) => {
    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    const { parentUniqueID, uniqueId } = selectedRow;
    const { data } = sampleData;

    let index = -1;

    if (parentUniqueID) {
        for (let i = 0; i < data.length; i++) {
            const subRowIndex = data[i].subRows.map((item) => item.uniqueId).indexOf(uniqueId);
            if (subRowIndex > -1) {
                index = i;
                break;
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].uniqueId === uniqueId) {
                index = i;
                break;
            }
        }
    }

    copiedRows.forEach((row, i) => {
        if (row.uniqueId) {
            const modifiedObj = Object.keys(row).filter((k) => k.indexOf('col') == 0).reduce((obj, key) => {
                obj[key] = row[key];
                return obj;
            }, {});
            modifiedObj['uniqueId'] = uuidv4();
            if (isForChild) {
                data[index].subRows.push({ ...modifiedObj });
            } else {
                modifiedObj['subRows'] = [];
                data.splice(index + i + 1, 0, { ...modifiedObj });
            }
        }
        if (hasCutOpPerf) {
            const { parentUniqueID, uniqueId } = row;
            let indexToRemove = -1;
            if (parentUniqueID) {
                for (let i = 0; i < data.length; i++) {
                    const subRowIndex = data[i].subRows.map((item) => item.uniqueId).indexOf(uniqueId);
                    if (subRowIndex > -1) {
                        indexToRemove = i;
                        break;
                    }
                }
                data[indexToRemove].subRows = data[indexToRemove].subRows.filter((item) => item.uniqueId !== row.uniqueId);
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].uniqueId === uniqueId) {
                        indexToRemove = i;
                        break;
                    }
                }
                data.splice(indexToRemove, 1);
            }

        }
    });

    updatedSampleData.data = [...sampleData.data];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForRowUpdate: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { pasteRows };

