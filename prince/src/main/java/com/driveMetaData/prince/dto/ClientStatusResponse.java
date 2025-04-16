package com.driveMetaData.prince.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientStatusResponse { // For parsing Redis JSON
    private String status;
}